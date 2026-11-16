import ProfileEditor from "../../components/ProfileEditor";
import { getCustomerProfile, updateCustomerProfile } from "../../services/Auth/CustomerAuth.service";

const fields = [
  { key: "full_name", label: "Họ và tên", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone_number", label: "Số điện thoại" },
  { key: "avatar", label: "URL ảnh đại diện" },
];

export default function CustomerAccount() {
  return <ProfileEditor title="Hồ sơ Customer" description="Thông tin hồ sơ chỉ được chính chủ tài khoản cập nhật." fields={fields} loadProfile={getCustomerProfile} saveProfile={updateCustomerProfile}/>;
}
