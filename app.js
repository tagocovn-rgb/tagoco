
const products = window.TAGOCO_PRODUCTS;
const fmt = n => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(n);
let cart = JSON.parse(localStorage.getItem('tagoco_cart') || '[]');

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const saveCart = () => { localStorage.setItem('tagoco_cart', JSON.stringify(cart)); renderCart(); };

function renderProducts(){
  $('#productGrid').innerHTML = products.map((p,i)=>`
    <article class="product-card">
      <div class="product-img"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <div class="product-bottom">
          <span class="price">${fmt(p.price)}</span>
          <button class="add-btn" data-add="${i}" title="Thêm vào giỏ">🛍</button>
        </div>
      </div>
    </article>`).join('');
}
function addToCart(i){
  const found = cart.find(x=>x.id===i);
  if(found) found.qty++; else cart.push({id:i,qty:1});
  saveCart(); openCart();
}
function renderCart(){
  $('#cartCount').textContent = cart.reduce((s,x)=>s+x.qty,0);
  const box=$('#cartItems');
  if(!cart.length){ box.innerHTML='<div class="empty">Giỏ hàng đang trống.</div>'; }
  else box.innerHTML=cart.map(x=>{
    const p=products[x.id];
    return `<div class="cart-row">
      <img src="${p.image}" alt="">
      <div><b>${p.name}</b><div class="price">${fmt(p.price)}</div>
        <div class="qty"><button data-dec="${x.id}">−</button><span>${x.qty}</span><button data-inc="${x.id}">+</button></div>
      </div>
      <button class="remove" data-remove="${x.id}">×</button>
    </div>`;
  }).join('');
  const total=cart.reduce((s,x)=>s+products[x.id].price*x.qty,0);
  $('#cartTotal').textContent=fmt(total); $('#checkoutTotal').textContent=fmt(total);
}
function openCart(){ $('#cartDrawer').classList.add('open'); $('#drawerBackdrop').classList.add('open'); }
function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#drawerBackdrop').classList.remove('open'); }
function openModal(id){ $('#'+id).classList.add('open'); $('#'+id).setAttribute('aria-hidden','false'); }
function closeModal(id){ $('#'+id).classList.remove('open'); $('#'+id).setAttribute('aria-hidden','true'); }
function orderCode(){
  const d=new Date(), y=String(d.getFullYear()).slice(-2), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
  const seq=String(Math.floor(Math.random()*900)+100);
  return `TG${y}${m}${day}${seq}`;
}
renderProducts(); renderCart();

document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]'); if(add) addToCart(+add.dataset.add);
  if(e.target.dataset.inc!==undefined){const x=cart.find(i=>i.id==e.target.dataset.inc);x.qty++;saveCart();}
  if(e.target.dataset.dec!==undefined){const x=cart.find(i=>i.id==e.target.dataset.dec);x.qty--;if(x.qty<=0)cart=cart.filter(i=>i.id!=x.id);saveCart();}
  if(e.target.dataset.remove!==undefined){cart=cart.filter(i=>i.id!=e.target.dataset.remove);saveCart();}
  if(e.target.dataset.close) closeModal(e.target.dataset.close);
});
$('#cartBtn').onclick=openCart; $('#closeCart').onclick=closeCart; $('#drawerBackdrop').onclick=closeCart;
$('#accountBtn').onclick=()=>openModal('accountModal');
$('#checkoutBtn').onclick=()=>{if(!cart.length)return alert('Giỏ hàng đang trống.');closeCart();openModal('checkoutModal');};
$('#menuBtn').onclick=()=>$('#mainNav').classList.toggle('open');

$$('.tab').forEach(btn=>btn.onclick=()=>{
  $$('.tab').forEach(x=>x.classList.remove('active')); $$('.tab-pane').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active'); $('#'+btn.dataset.tab).classList.add('active');
});
$('#registerPane').onsubmit=e=>{
  e.preventDefault();
  const user={name:$('#regName').value,phone:$('#regPhone').value,email:$('#regEmail').value,password:$('#regPass').value};
  localStorage.setItem('tagoco_user',JSON.stringify(user));
  $('#registerNote').textContent='Tạo tài khoản thành công. Bạn có thể đặt hàng nhanh hơn ở lần sau.';
  $('#orderName').value=user.name; $('#orderPhone').value=user.phone;
};
$('#loginPane').onsubmit=e=>{
  e.preventDefault(); const user=JSON.parse(localStorage.getItem('tagoco_user')||'null');
  if(user && ($('#loginUser').value===user.phone || $('#loginUser').value===user.email) && $('#loginPass').value===user.password){
    $('#loginNote').textContent=`Xin chào ${user.name}!`; $('#orderName').value=user.name; $('#orderPhone').value=user.phone;
  } else $('#loginNote').textContent='Thông tin đăng nhập chưa đúng.';
};
$('#checkoutForm').onsubmit=e=>{
  e.preventDefault();
  const code=orderCode(), orders=JSON.parse(localStorage.getItem('tagoco_orders')||'[]');
  orders.push({code,status:0,created:new Date().toISOString(),name:$('#orderName').value,phone:$('#orderPhone').value,address:$('#orderAddress').value,items:cart});
  localStorage.setItem('tagoco_orders',JSON.stringify(orders));
  cart=[];saveCart();closeModal('checkoutModal');$('#successCode').textContent=code;openModal('successModal');e.target.reset();
};
$('#lookupForm').onsubmit=e=>{
  e.preventDefault(); const code=$('#lookupCode').value.trim().toUpperCase();
  const orders=JSON.parse(localStorage.getItem('tagoco_orders')||'[]'), order=orders.find(o=>o.code===code);
  if(!order){$('#lookupResult').innerHTML='<div class="status-box">Chưa tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn.</div>';return;}
  const steps=['Đang xác nhận','Đang chuẩn bị hàng','Đang giao','Đã giao thành công'];
  $('#lookupResult').innerHTML=`<div class="status-box"><b>Đơn ${order.code}</b><div class="status-steps">${steps.map((s,i)=>`<div class="status-step ${i<=order.status?'active':''}">${s}</div>`).join('')}</div></div>`;
};
$$('nav a').forEach(a=>a.onclick=()=>$('#mainNav').classList.remove('open'));
