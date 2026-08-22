"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "../../../redux/features/api/categoriesApi";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/slice/authSlice";
import { useLogoutMutation, useGetMeQuery, useUpdateUserMutation, useDeleteAccountMutation } from "../../../redux/features/api/authApi";
import Header from "../components/Header";
import { useGetWishlistQuery, useToggleWishlistMutation } from "../../../redux/features/api/wishlistApi";
import { useGetCartQuery, useAddCartItemMutation } from "../../../redux/features/api/cartApi";
import { toast } from "react-hot-toast";

// Extracted Components
import ProfileSidebar from "../../../components/profile/ProfileSidebar";
import MobileDrawer from "../../../components/profile/MobileDrawer";
import EditProfileForm from "../../../components/profile/EditProfileForm";
import ProfileBanner from "../../../components/profile/ProfileBanner";
import ProfileInfo from "../../../components/profile/ProfileInfo";
import DeleteAccountSection from "../../../components/profile/DeleteAccountSection";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const { data: meRes, isLoading: isMeLoading } = useGetMeQuery();
  const user = meRes?.user || meRes?.data || meRes;
  const [updateUserApi, { isLoading: isUpdating }] = useUpdateUserMutation();

  const { data: wishlistData, isLoading: isWishlistLoading } = useGetWishlistQuery();
  const [toggleWishlistMut] = useToggleWishlistMutation();
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();
  const [addCartItemMut] = useAddCartItemMutation();

  const wishlistItems = Array.isArray(wishlistData?.data) ? wishlistData.data : (wishlistData?.data?.data || []);

  const handleRemoveWishlist = async (item: any) => {
    try {
      await toggleWishlistMut({ menu_item_id: item.menu_item_id }).unwrap();
      toast.success(`${item.menu_item?.name || 'Item'} removed from wishlist`);
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (item: any) => {
    try {
      const cartId = cartData?.id || cartData?.data?.id;
      if (!cartId) {
        toast.error("Cart not ready");
        return;
      }
      await addCartItemMut({
        cart_id: cartId,
        menu_item_id: item.menu_item_id,
        quantity: 1
      }).unwrap();
      refetchCart();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/customer")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const [activeCategory, setActiveCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState("/customer/cover-image.png");
  const [profilePhoto, setProfilePhoto] = useState("/customer/profile.png");
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Delete Account States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteAccountApi, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    country: "UK",
    post_code: "NW1 6XE",
    city: "London",
    address_line_1: "221B Baker Street",
    address_line_2: "Marylebone",
  });

  useEffect(() => {
    if (user) {
      const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.pacinos.uk";
        return `${baseUrl}/storage/${path}`;
      };

      if (user.avatar) setProfilePhoto(getImageUrl(user.avatar));
      if (user.user_image) setCoverPhoto(getImageUrl(user.user_image));

      const defaultAddress = user.addresses?.[0] || {};
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        country: defaultAddress.country || "UK",
        post_code: defaultAddress.postal_code || defaultAddress.post_code || "NW1 6XE",
        city: defaultAddress.city || "London",
        address_line_1: defaultAddress.address_line_1 || "221B Baker Street",
        address_line_2: defaultAddress.address_line_2 || "Marylebone",
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    try {
      const hasFiles = coverPhotoFile || profilePhotoFile;
      let payload: any = {};
      
      if (hasFiles) {
        payload = new FormData();
        if (formData.name) payload.append("name", formData.name);
        if (formData.email) payload.append("email", formData.email);
        if (formData.phone) payload.append("phone", formData.phone);
        if (profilePhotoFile) payload.append("avatar", profilePhotoFile);
        if (coverPhotoFile) payload.append("user_image", coverPhotoFile);
      } else {
        if (formData.name) payload.name = formData.name;
        if (formData.email) payload.email = formData.email;
        if (formData.phone) payload.phone = formData.phone;
      }

      await updateUserApi({ id: user.id, data: payload }).unwrap();
      setIsEditing(false);
      setCoverPhotoFile(null);
      setProfilePhotoFile(null);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCoverPhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      if (!isEditing && user?.id) {
        try {
          const payload = new FormData();
          payload.append("user_image", file);
          await updateUserApi({ id: user.id, data: payload }).unwrap();
          setCoverPhotoFile(null);
        } catch (error) {
          console.error("Failed to update cover photo", error);
        }
      }
    }
  };

  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setProfilePhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      if (!isEditing && user?.id) {
        try {
          const payload = new FormData();
          payload.append("avatar", file);
          await updateUserApi({ id: user.id, data: payload }).unwrap();
          setProfilePhotoFile(null);
        } catch (error) {
          console.error("Failed to update profile photo", error);
        }
      }
    }
  };

  const { data: categoriesRes } = useGetCategoriesQuery({ all: 1 });
  const categoriesList = categoriesRes?.data || categoriesRes || [];

  const handleLogout = () => {

    logoutApi({}).catch(error => console.error('Logout API error:', error));
    dispatch(logout());
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }
    try {
      await deleteAccountApi({ password: deletePassword }).unwrap();
      toast.success("Account deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletePassword("");
      dispatch(logout());
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete account");
      setDeletePassword("");
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#1E1E20] flex flex-col lg:flex-row text-white overflow-hidden font-sans select-none relative">
      <ProfileSidebar 
        categoriesList={categoriesList}
        activeCategory={activeCategory}
        handleLogout={handleLogout}
        router={router}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Top Header */}
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Dashboard Content */}
        <main className="flex-1 h-full px-4 sm:px-8 py-6 lg:py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {isEditing ? (
            <EditProfileForm 
              profilePhoto={profilePhoto}
              handleProfileChange={handleProfileChange}
              formData={formData}
              handleInputChange={handleInputChange}
              isUpdating={isUpdating}
              handleSaveProfile={handleSaveProfile}
              setIsEditing={setIsEditing}
            />
          ) : (
            <>
              <ProfileBanner 
                user={user}
                coverPhoto={coverPhoto}
                profilePhoto={profilePhoto}
                handleCoverChange={handleCoverChange}
                handleProfileChange={handleProfileChange}
                setIsEditing={setIsEditing}
                router={router}
              />
              <ProfileInfo 
                user={user}
                wishlistItems={wishlistItems}
                isWishlistLoading={isWishlistLoading}
                handleRemoveWishlist={handleRemoveWishlist}
                handleAddToCart={handleAddToCart}
                getImageUrl={getImageUrl}
              />
              <DeleteAccountSection 
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                deletePassword={deletePassword}
                setDeletePassword={setDeletePassword}
                isDeletingAccount={isDeletingAccount}
                handleDeleteAccount={handleDeleteAccount}
              />
            </>
          )}
        </main>
      </div>

      <MobileDrawer 
        categoriesList={categoriesList}
        activeCategory={activeCategory}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        router={router}
      />
    </div>
  );
}
