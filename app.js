const products = [
  {id:"black-gold", name:"TAGOCO Trucker Heritage", price:199000, color:"Đen / Vàng", cap:"#151515", mesh:"#252525", logo:"#c9a15a", bg:"#ded9cf", desc:"Nón trucker 6 múi với form cao vừa, lưỡi cong nhẹ và khóa điều chỉnh phía sau. Thiết kế cân đối, dễ đội và phù hợp sử dụng hằng ngày."},
  {id:"cream-black", name:"TAGOCO Trucker Sand", price:199000, color:"Kem / Đen", cap:"#e8dfcf", mesh:"#1f1f1f", logo:"#111111", bg:"#d7d1c4", desc:"Phối màu kem thanh lịch, dễ kết hợp trang phục và tạo cảm giác sáng, sạch, hiện đại."},
  {id:"green-gold", name:"TAGOCO Trucker Peacock", price:219000, color:"Xanh / Vàng", cap:"#173d34", mesh:"#102b25", logo:"#c4a15f", bg:"#c9d0c8", desc:"Màu xanh chim công đặc trưng TAGOCO kết hợp sắc vàng kim, tạo dấu ấn sang trọng và dễ nhận diện."}
];

let cart = JSON.parse(localStorage.getItem("tagoco_cart") || "[]");
let selectedProduct = null;
let lastCustomer = null;

const $ = s => document.querySelector(s);
const format = n => new Intl.NumberFormat("vi-VN").format(n) + "đ";
const saveCart = () => localStorage.setItem("tagoco_cart", JSON.stringify(cart));

function capMarkup(p, scale=""){
  return `<div class="mini-cap" style="--cap:${p.cap};--mesh:${p.mesh};--logo:${p.logo};${scale}">
    <div class="mini-crown">TGC</div><div class="mini-brim"></div>
  </div>`;
}

function renderProducts(){
  $("#productGrid").innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-image" style="background:${p.bg}">${capMarkup(p)}</div>
      <div class="product-meta">
        <div class="product-meta-top"><h3>${p.name}</h3><span class="price">${format(p.price)}</span></div>
        <div class="swatches"><span class="swatch" style="background:${p.cap}"></span><span class="swatch" style="background:${p.mesh}"></span></div>
        <div class="card-actions">
          <button onclick="openProduct('${p.id}')">Xem chi tiết</button>
          <button class="quick-add" onclick="addToCart('${p.id}',1)">Thêm vào giỏ</button>
        </div>
      </div>
    </article>`).join("");
}

function showToast(text){
  const t=$("#toast"); t.textContent=text; t.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200);
}

function updateCartCount(){
  $("#cartCount").textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function addToCart(id, qty=1){
  const found=cart.find(i=>i.id===id);
  found ? found.qty += qty : cart.push({id,qty});
  saveCart(); updateCartCount(); renderCart(); showToast("Đã thêm sản phẩm vào giỏ");
}

function changeQty(id, delta){
  const item=cart.find(i=>i.id===id); if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart=cart.filter(i=>i.id!==id);
  saveCart(); updateCartCount(); renderCart();
}

function removeItem(id){ cart=cart.filter(i=>i.id!==id); saveCart(); updateCartCount(); renderCart(); }

function cartTotal(){return cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+p.price*i.qty},0)}

function renderCart(){
  if(!cart.length){
    $("#cartItems").innerHTML=`<div class="empty">Giỏ hàng đang trống.<br>Hãy chọn chiếc nón bạn thích.</div>`;
  } else {
    $("#cartItems").innerHTML=cart.map(i=>{
      const p=products.find(x=>x.id===i.id);
      return `<div class="cart-item">
        <div class="cart-thumb" style="background:${p.bg}">🧢</div>
        <div><strong>${p.name}</strong><div class="muted">${p.color}</div>
          <div class="qty-control"><button onclick="changeQty('${i.id}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${i.id}',1)">+</button></div>
        </div>
        <div style="text-align:right"><strong>${format(p.price*i.qty)}</strong><br><button class="remove-link" onclick="removeItem('${i.id}')">Xóa</button></div>
      </div>`;
    }).join("");
  }
  $("#cartTotal").textContent=format(cartTotal());
}

function openLayer(el){
  $("#overlay").classList.add("open"); el.classList.add("open"); el.setAttribute("aria-hidden","false");
}
function closeAll(){
  $("#overlay").classList.remove("open");
  document.querySelectorAll(".drawer.open,.modal.open").forEach(x=>{x.classList.remove("open");x.setAttribute("aria-hidden","true")});
}

window.openProduct=function(id){
  selectedProduct=products.find(p=>p.id===id);
  $("#productModalContent").innerHTML=`
    <div class="product-detail">
      <div class="product-detail-visual" style="background:${selectedProduct.bg}">${capMarkup(selectedProduct)}</div>
      <div>
        <span class="eyebrow">TAGOCO TRUCKER</span>
        <h2>${selectedProduct.name}</h2>
        <div class="detail-price">${format(selectedProduct.price)}</div>
        <div class="option-row"><strong>Màu sắc</strong><div class="color-options"><button class="color-option active">${selectedProduct.color}</button></div></div>
        <div class="option-row"><strong>Số lượng</strong><div class="qty-control"><button id="detailMinus">−</button><span id="detailQty">1</span><button id="detailPlus">+</button></div></div>
        <button class="btn btn-primary full" id="detailAdd">Thêm vào giỏ hàng</button>
        <p class="product-description">${selectedProduct.desc}<br><br>Free size · Khóa điều chỉnh phía sau · Phù hợp vòng đầu phổ biến của người Việt.</p>
      </div>
    </div>`;
  let q=1;
  $("#detailMinus").onclick=()=>{q=Math.max(1,q-1);$("#detailQty").textContent=q};
  $("#detailPlus").onclick=()=>{q++;$("#detailQty").textContent=q};
  $("#detailAdd").onclick=()=>{addToCart(selectedProduct.id,q);closeAll();openLayer($("#cartDrawer"))};
  openLayer($("#productModal"));
}

function loadSavedCustomer(){
  const acc=JSON.parse(localStorage.getItem("tagoco_account")||"null");
  if(acc){
    ["name","phone","address"].forEach(k=>{const el=$(`#checkoutForm [name="${k}"]`);if(el) el.value=acc[k]||""});
  }
}

function openCheckout(){
  if(!cart.length){showToast("Giỏ hàng đang trống");return}
  closeAll();
  $("#orderSummary").innerHTML=`<h3>Đơn hàng của bạn</h3>`+cart.map(i=>{
    const p=products.find(x=>x.id===i.id);
    return `<div class="summary-item"><span>${p.name} × ${i.qty}</span><strong>${format(p.price*i.qty)}</strong></div>`
  }).join("")+`<div class="total-row" style="margin-top:20px"><span>Tổng cộng</span><strong>${format(cartTotal())}</strong></div>`;
  loadSavedCustomer(); openLayer($("#checkoutModal"));
}

function generateOrderCode(){
  const d=new Date(), yy=String(d.getFullYear()).slice(-2), mm=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0");
  const orders=JSON.parse(localStorage.getItem("tagoco_orders")||"[]");
  const seq=String(orders.length+1).padStart(3,"0");
  return `TG${yy}${mm}${dd}${seq}`;
}

$("#checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const customer=Object.fromEntries(fd.entries());
  const order={
    code:generateOrderCode(), date:new Date().toLocaleString("vi-VN"),
    customer, items:cart.map(i=>({...i})), total:cartTotal(), status:"Đang xác nhận"
  };
  const orders=JSON.parse(localStorage.getItem("tagoco_orders")||"[]");
  orders.unshift(order); localStorage.setItem("tagoco_orders",JSON.stringify(orders));
  lastCustomer=customer; cart=[]; saveCart(); updateCartCount(); renderCart();
  closeAll(); $("#successOrderCode").textContent=order.code; $("#newPassword").value=""; $("#accountMessage").textContent="";
  openLayer($("#successModal"));
});

$("#createAccountBtn").onclick=()=>{
  const password=$("#newPassword").value.trim();
  if(password.length<4){$("#accountMessage").textContent="Mật khẩu cần ít nhất 4 ký tự.";return}
  if(!lastCustomer){$("#accountMessage").textContent="Không tìm thấy thông tin đơn hàng.";return}
  localStorage.setItem("tagoco_account",JSON.stringify({...lastCustomer,password}));
  $("#accountMessage").textContent="✓ Đã tạo tài khoản và lưu thông tin trên thiết bị này.";
};

$("#lookupForm").addEventListener("submit",e=>{
  e.preventDefault();
  const code=$("#lookupCode").value.trim().toUpperCase();
  const orders=JSON.parse(localStorage.getItem("tagoco_orders")||"[]");
  const o=orders.find(x=>x.code===code);
  $("#lookupResult").innerHTML=o ? `<div class="lookup-result">
    <span class="eyebrow">ĐƠN HÀNG HỢP LỆ</span><h3>${o.code}</h3>
    <p><strong>Ngày đặt:</strong> ${o.date}</p><p><strong>Trạng thái:</strong> 📦 ${o.status}</p>
    <p><strong>Tổng tiền:</strong> ${format(o.total)}</p>
  </div>` : `<div class="lookup-result"><strong>Không tìm thấy đơn hàng.</strong><p class="muted">Vui lòng kiểm tra lại mã đơn đã nhập.</p></div>`;
});

function showAccount(){
  const acc=JSON.parse(localStorage.getItem("tagoco_account")||"null");
  const orders=JSON.parse(localStorage.getItem("tagoco_orders")||"[]");
  $("#accountContent").innerHTML=acc ? `
    <h2>Xin chào, ${acc.name}</h2>
    <div class="account-data"><strong>Thông tin đã lưu</strong><p>${acc.phone}</p><p>${acc.address}</p></div>
    <p>Bạn có <strong>${orders.length}</strong> đơn hàng trên thiết bị này.</p>
    <button class="btn btn-secondary full" id="logoutBtn">Đăng xuất và xóa thông tin</button>` :
    `<h2>Chưa có tài khoản</h2><p class="muted">Sau khi đặt đơn đầu tiên, bạn có thể tạo tài khoản để lưu thông tin cho lần mua sau.</p>`;
  openLayer($("#accountModal"));
  const b=$("#logoutBtn"); if(b) b.onclick=()=>{localStorage.removeItem("tagoco_account");closeAll();showToast("Đã xóa thông tin tài khoản")};
}

$("#cartBtn").onclick=()=>{renderCart();openLayer($("#cartDrawer"))};
$("#accountBtn").onclick=showAccount;
$("#checkoutBtn").onclick=openCheckout;
$("#overlay").onclick=closeAll;
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeAll);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});

renderProducts(); renderCart(); updateCartCount();
