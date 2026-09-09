// Renders the Sep 2026 calendar grid with demo status dots (mirrors design).
const statusByDay = {1:'#1FAE6E',2:'#8B5CF6',3:'#1FAE6E',4:'#1FAE6E',5:'#8C93A3',6:'#8C93A3',
7:'#2F6BFF',8:'#1FAE6E',9:'#1FAE6E',10:'#F5A623',11:'#1FAE6E',12:'#8C93A3',13:'#8C93A3',
14:'#1FAE6E',15:'#E5484D',16:'#1FAE6E',17:'#1FAE6E',18:'#1FAE6E',19:'#8C93A3',20:'#8C93A3',
21:'#1FAE6E',22:'#1FAE6E',23:'#1FAE6E',24:'#1FAE6E',25:'#1FAE6E',26:'#8C93A3',27:'#8C93A3'};
const grid = document.getElementById('grid');
let html = '<div class="date-cell"><span class="num" style="color:#9AA3B2">31</span></div>';
for (let d = 1; d <= 27; d++) {
  const sel = d === 3 ? 'selected' : '';
  html += `<div class="date-cell ${sel}"><span class="num">${d}</span><span class="dot" style="background:${statusByDay[d]}"></span></div>`;
}
grid.innerHTML = html;
document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));
