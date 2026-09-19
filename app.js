const config=window.GUILD_CONFIG||{},data=window.GUILD_DATA||{};
const $=id=>document.getElementById(id);
const safeText=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=text||'';if(cls)e.className=cls;return e};
const roster=$('rosterCards');(data.roster||[]).forEach(m=>{const card=safeText('article','','member');card.append(safeText('div',m.initial,'avatar'),safeText('span',m.role,'role'),safeText('h3',m.name),safeText('p',m.className));roster.append(card)});
const news=$('newsCards');(data.news||[]).forEach(n=>{const card=safeText('article','','news-card');card.append(safeText('span',n.date,'date'),safeText('h3',n.title),safeText('p',n.body));news.append(card)});
const gallery=$('galleryCards');(data.gallery||[]).forEach(g=>{const card=safeText('article','','gallery-card'),visual=safeText('div','','gallery-image'),copy=safeText('div','','copy');if(g.image){const img=document.createElement('img');img.src=g.image;img.alt=g.title;img.loading='lazy';visual.append(img)}else visual.textContent='⚔';copy.append(safeText('h3',g.title),safeText('p',g.caption));card.append(visual,copy);gallery.append(card)});
$('menu').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('menu').setAttribute('aria-expanded',String(open))});document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>{$('nav').classList.remove('open');$('menu').setAttribute('aria-expanded','false')}));
$('applyForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget),email=config.recruitmentEmail;if(!email||!/^\S+@\S+\.\S+$/.test(email)){$('applyStatus').textContent='Applications are not configured yet. Please join our Discord to apply.';window.open(config.discordInvite||'https://discord.gg/cuGad4an','_blank','noopener,noreferrer');return}const subject=`Guild application: ${f.get('character')}`;const body=`Character: ${f.get('character')}\nClass / Spec: ${f.get('classSpec')}\nExperience: ${f.get('experience')}\n\nMessage:\n${f.get('message')||'(none)'}`;location.href=`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;$('applyStatus').textContent='Your email app should open with your application. Send the email to finish applying.'});

const dialog = $('loginDialog');

// Open the existing Member Portal.
$('loginBtn').addEventListener('click', () => {
  if (!dialog.open) {
    dialog.showModal();
  }
});

// Allow the homepage login hotspot to open it too.
document.querySelectorAll('[data-open-login]').forEach(button => {
  button.addEventListener('click', () => {
    if (!dialog.open) {
      dialog.showModal();
    }
  });
});

// Supabase authentication is handled by auth.js.
