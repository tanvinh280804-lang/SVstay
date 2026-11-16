import ProfileEditor from "../../components/ProfileEditor";
import { getMyAdminProfile, updateMyAdminProfile } from "../../services/Admin/Profile.service";

const fields = [
  { key: "username", label: "Tên đăng nhập", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Số điện thoại", required: true },
  { key: "avatar_url", label: "URL ảnh đại diện" },
];

export default function Profile() {
  return <ProfileEditor title="Hồ sơ Admin" description="Cập nhật thông tin tài khoản Admin của bạn." fields={fields} loadProfile={getMyAdminProfile} saveProfile={updateMyAdminProfile}/>;
}
