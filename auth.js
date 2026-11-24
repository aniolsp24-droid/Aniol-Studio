const authGate=document.getElementById("authGate");
const studioApp=document.getElementById("studioApp");
const signInBox=document.getElementById("clerkSignIn");
const signUpBox=document.getElementById("clerkSignUp");
const authError=document.getElementById("authError");
let authMode="sign-in";
function renderAuthMode(mode){
  authMode=mode;
  document.getElementById("showSignIn").classList.toggle("active",mode==="sign-in");
  document.getElementById("showSignUp").classList.toggle("active",mode==="sign-up");
  signInBox.hidden=mode!=="sign-in";
  signUpBox.hidden=mode!=="sign-up";
  if(!window.Clerk)return;
  if(mode==="sign-in"){
    Clerk.unmountSignUp(signUpBox);
    Clerk.mountSignIn(signInBox);
  }else{
    Clerk.unmountSignIn(signInBox);
    Clerk.mountSignUp(signUpBox);
  }
}
function updateAccess(user){
  const signedIn=Boolean(user);
  authGate.style.display=signedIn?"none":"flex";
  studioApp.style.display=signedIn?"block":"none";
  if(signedIn){
    const avatar=document.querySelector(".top-actions .avatar");
    if(avatar && !avatar.dataset.clerkMounted){
      avatar.dataset.clerkMounted="true";
      avatar.textContent="";
      Clerk.mountUserButton(avatar);
    }
  }
}
document.getElementById("showSignIn").addEventListener("click",()=>renderAuthMode("sign-in"));
document.getElementById("showSignUp").addEventListener("click",()=>renderAuthMode("sign-up"));
(async function initClerkGate(){
  try{
    const started=Date.now();
    while(!window.Clerk && Date.now()-started<15000) await new Promise(r=>setTimeout(r,100));
    if(!window.Clerk) throw new Error("Clerk SDK unavailable");
    await Clerk.load();
    Clerk.addListener(({user})=>updateAccess(user));
    updateAccess(Clerk.user);
    if(!Clerk.user) renderAuthMode("sign-in");
  }catch(error){
    console.error("Clerk authentication failed:",error);
    authError.hidden=false;
  }
})();