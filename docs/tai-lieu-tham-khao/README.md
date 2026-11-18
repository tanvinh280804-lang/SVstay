# Bộ tài liệu tham khảo SVStay – CS445

Thư mục này chứa 7 tài liệu `.docx` thuộc **nhóm tài liệu cốt lõi** của đồ án SVStay, được xây dựng dựa trên mã nguồn thực tế trong `client/` và `server/`.

## Danh sách tài liệu

| # | Tệp | Nội dung | Số trang |
|---|-----|----------|----------|
| 1 | `01-Project-Proposal_SVStay.docx` | Đề xuất dự án: vấn đề, mục tiêu, phạm vi, giải pháp, công nghệ, rủi ro. Bám sát mẫu Proposal của giảng viên. | 18 |
| 2 | `02-Project-Plan_SVStay.docx` | Kế hoạch dự án: tổ chức nhóm, Scrum, WBS, milestone, sprint, RACI, chất lượng, cấu hình. | 21 |
| 3 | `03-User-Stories_SVStay.docx` | 18 User Story (US-01…US-18) kèm tiêu chí chấp nhận và trạng thái. | 22 |
| 4 | `04-Product-Backlog_SVStay.docx` | Product Backlog 18 story – 89 story point, ưu tiên MoSCoW, phân bổ sprint. | 14 |
| 5 | `05-Architecture_SVStay.docx` | Kiến trúc As-is/To-be, module, API hiện có, bảo mật, 18 lỗi BUG-01…BUG-18, 6 ADR. | 23 |
| 6 | `06-Database-Design_SVStay.docx` | Mô hình dữ liệu hiện có (admins, owners, roomtypes) và đề xuất mở rộng. | 20 |
| 7 | `07-UI-Design_SVStay.docx` | Nguyên tắc thiết kế, design token, sitemap, 21 màn hình UI-01…UI-21, component library. | 21 |

Mục lục của cả 7 tài liệu đã được cập nhật sẵn bằng Microsoft Word (có số trang). Nếu chỉnh sửa nội dung, bấm `Ctrl+A` rồi `F9` để cập nhật lại mục lục.

> **Riêng tài liệu 01:** được dựng lại trực tiếp từ file mẫu `1.Proposal-ver.1.0.1.docx` của giảng viên, giữ nguyên khổ Letter, lề 2,54 cm, Times New Roman 13, giãn dòng 1,5, hệ heading tự đánh số `1. / 1.1. / 1.1.1.` và đúng danh mục mục 1–3.5 của mẫu; toàn bộ nội dung mẫu đã được thay bằng SVStay, kèm 2 sơ đồ (ngữ cảnh hệ thống và quy trình Scrum).

## Quy ước trạng thái

- **[AS-IS]** – Chức năng đã có trong mã nguồn hiện tại và đã được kiểm chứng.
- **[PARTIAL]** – Đã có một phần (thường là API đã có, giao diện chưa có).
- **[TO-BE]** – Chức năng nằm trong kế hoạch, chưa triển khai.
- **[...]** – Thông tin nhóm tự điền (họ tên, MSSV, GVHD, ngày tháng, URL repo…).

## Quy ước mã định danh

`US-xx` (User Story) · `EPIC-xx` (Epic) · `TASK-xx` (Sprint Backlog) · `TC-xx` (Test Case) · `BUG-xx` (Lỗi/tech debt) · `ADR-xx` (Architecture Decision Record) · `UI-xx` (Màn hình).

## Việc nhóm cần làm trước khi nộp

1. Điền toàn bộ placeholder `[...]`: tên trường/khoa, GVHD, thành viên, MSSV, ngày tháng, URL repo, logo trường.
2. Chèn ảnh chụp màn hình thật hoặc ảnh export từ Stitch/Figma vào các vị trí `[CHÈN ẢNH …]` trong tài liệu UI Design.
3. Đối chiếu lại số liệu (story point, số lỗi, kết quả test) tại thời điểm nộp.
4. Kiểm tra không còn nội dung của dự án mẫu; toàn bộ nội dung phải mang thương hiệu SVStay.
5. Bổ sung nhóm tài liệu Kiểm thử, Sprint và Biên bản họp nếu giảng viên yêu cầu đủ bộ.

## Ghi chú

- Tài liệu phản ánh mã nguồn tại thời điểm lập; **không có mã nguồn nào bị thay đổi**.
- Các nội dung `[TO-BE]` chỉ là kế hoạch, không phải chức năng đã hoàn thành.
- Bộ tài liệu này là bản tham khảo (~80% nội dung), cần nhóm rà soát và hoàn thiện trước khi nộp chính thức.
