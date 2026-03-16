"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Package,
  ShoppingBag,
  DollarSign,
  Camera,
  Save,
  Lock,
  MapPin,
  Store,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  TrendingUp,
  Award,
} from "lucide-react";

// Helper function to get full image URL
const getImageUrl = (path: string | undefined) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  // Remove any duplicate slashes
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  const imagePath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${imagePath}`;
};

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    isUpdating,
    updateVendorProfile,
    changePassword,
    uploadImage,
  } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    storeName: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted rounded-full mb-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
            <p className="text-sm text-muted-foreground text-center">
              We couldn't find your profile information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      fullName: profile.fullName,
      phone: profile.phone,
      location: profile.location || "",
      storeName: profile.storeName,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateVendorProfile(formData);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    await changePassword(passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Status badge styling like orders page
  const getStatusBadge = () => {
    if (profile.verified) {
      return (
        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - matching orders page style */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and store settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            {!isEditing && (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Overview Card - Clean and professional */}
        <Card className="mb-8 overflow-hidden">
          {/* Simple header with subtle gradient */}
          <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          
          <CardContent className="relative px-8 pb-8">
            {/* Avatar Section */}
            <div className="flex items-start gap-8 -mt-12">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                  <AvatarImage src={getImageUrl(profile.profileImage)} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {getInitials(profile.fullName)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg border-2 border-background"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Basic Info */}
              <div className="pt-4">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
                  {profile.totalRevenue >= 1000000 && (
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                      <Award className="h-3 w-3 mr-1" />
                      Top Seller
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Store className="h-4 w-4" />
                  {profile.storeName}
                </p>
              </div>
            </div>

            {/* Contact Details - Clean grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{profile.phone}</p>
                </div>
              </div>
              {profile.location && (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{profile.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">
                    {new Date(profile.createdAt).toLocaleDateString("en-US", { 
                      month: "short", 
                      year: "numeric" 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards - Matching orders page style */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Items in store</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{profile.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦
                {profile.totalOrders > 0
                  ? Math.round(profile.totalRevenue / profile.totalOrders).toLocaleString()
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Matching orders page style */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="store">Store Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{profile.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Email Address
                    </label>
                    <p className="text-sm font-medium text-muted-foreground">
                      {profile.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{profile.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Location
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Enter your location"
                      />
                    ) : (
                      <p className="text-sm font-medium">
                        {profile.location || "Not set"}
                      </p>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2 pt-6 mt-4 border-t">
                    <Button onClick={handleSave} disabled={isUpdating}>
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={isUpdating}
                    className="mt-2"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {isUpdating ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Store Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Store Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.storeName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            storeName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div>
                        <p className="text-sm font-medium">
                          {profile.storeName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your public store name
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Store URL
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        /store/{profile.storeSlug}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        Public
                      </Badge>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Verification Status
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      {profile.verified ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-sm font-medium">Verified Account</p>
                            <p className="text-xs text-muted-foreground">
                              Your account is verified and trusted
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Clock className="h-5 w-5 text-amber-500" />
                          <div>
                            <p className="text-sm font-medium">Pending Verification</p>
                            <p className="text-xs text-muted-foreground">
                              Complete verification to build trust
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Member Since
                    </label>
                    <p className="text-sm font-medium">
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Professional Skeleton Loader - Matching orders page
const ProfilePageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="flex justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Profile Card Skeleton */}
      <Card className="mb-8">
        <Skeleton className="h-24 w-full" />
        <CardContent className="p-8">
          <div className="flex gap-8 -mt-12">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Contact Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="h-10 w-64 mb-4" />

      {/* Content Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);