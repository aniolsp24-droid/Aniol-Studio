const authGate=document.getElementById("authGate");
const studioApp=document.getElementById("studioApp");
const signInBox=document.getElementById("clerkSignIn");
const signUpBox=document.getElementById("clerkSignUp");
const authError=document.getElementById("authError");
let mountedSignIn=false;
let mountedSignUp=false;
function renderAuthMode(mode){
  const signingIn=mode==="sign-in";
  document.getElementById("showSignIn").classList.toggle("active",signingIn);
  document.getElementById("showSignUp").classList.toggle("active",!signingIn);
  signInBox.hidden=!signingIn;
  signUpBox.hidden=signingIn;
  try{
    if(signingIn && !mountedSignIn){Clerk.mountSignIn(signInBox);mountedSignIn=true;}
    if(!signingIn && !mountedSignUp){Clerk.mountSignUp(signUpBox);mountedSignUp=true;}
  }catch(error){console.error("Clerk component mount error:",error);authError.hidden=false;}
}
function updateAccess(user){
  const signedIn=Boolean(user);
  authGate.style.display=signedIn?"none":"flex";
  studioApp.style.display=signedIn?"block":"none";
  if(signedIn){
    const avatar=document.querySelector(".top-actions .avatar");
    if(avatar && !avatar.dataset.clerkMounted){avatar.dataset.clerkMounted="true";avatar.textContent="";Clerk.mountUserButton(avatar);}
  }
}
document.getElementById("showSignIn").addEventListener("click",()=>renderAuthMode("sign-in"));
document.getElementById("showSignUp").addEventListener("click",()=>renderAuthMode("sign-up"));
(async function initClerkGate(){
  try{
    const started=Date.now();
    while((!window.Clerk || !window.__internal_ClerkUICtor) && Date.now()-started<20000) await new Promise(resolve=>setTimeout(resolve,100));
    if(!window.Clerk || !window.__internal_ClerkUICtor) throw new Error("Clerk SDK/UI bundle did not load");
    await Clerk.load({ui:{ClerkUI:window.__internal_ClerkUICtor}});
    Clerk.addListener(({user})=>updateAccess(user));
    updateAccess(Clerk.user);
    if(!Clerk.user) renderAuthMode("sign-in");
  }catch(error){console.error("Clerk authentication failed:",error);authError.hidden=false;authError.textContent="No s'ha pogut carregar Clerk. Comprova la connexió i actualitza la pàgina.";}
})();