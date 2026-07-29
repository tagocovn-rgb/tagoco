# Website TAGOCO

Website tĩnh dùng HTML, CSS và JavaScript, triển khai miễn phí trên Cloudflare Pages.

## Các file cần sửa thường xuyên

- `content.js`: tên sản phẩm, giá, mô tả và các đường dẫn mạng xã hội.
- `index.html`: nội dung giới thiệu, tiêu đề, câu chuyện thương hiệu.
- `style.css`: màu sắc, kích thước và giao diện.
- `assets/`: ảnh logo, ảnh nón, ảnh lookbook.

## Thêm ảnh sản phẩm

1. Upload ảnh vào thư mục `assets`.
2. Trong `content.js`, sửa:

```js
image: "assets/ten-anh.jpg"
```

## Cập nhật website

Sau khi sửa file trên GitHub, bấm **Commit changes**. Cloudflare Pages sẽ tự động cập nhật website sau khoảng 1 phút.
