import ProfileEditor from "../../components/ProfileEditor";
import { getOwnerProfile, updateOwnerProfile } from "../../services/Auth/OwnerLogin.service";

const fields = [
  { key: "full_name", label: "Họ và tên", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone_number", label: "Số điện thoại", required: true },
  { key: "identity_card", label: "Số CCCD", required: true },
  { key: "address", label: "Địa chỉ", required: true },
  { key: "avatar", label: "URL ảnh đại diện" },
];

export default function OwnerProfile() {
  return <ProfileEditor title="Hồ sơ Owner" description="Cập nhật thông tin cá nhân và thông tin xác minh của bạn." fields={fields} loadProfile={getOwnerProfile} saveProfile={updateOwnerProfile}/>;
}
