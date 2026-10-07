import{jsx as _jsx,jsxs as _jsxs,Fragment as _Fragment}from"react/jsx-runtime";import{addPropertyControls,ControlType}from"framer";import{useEffect,useMemo,useState}from"react";import{createPortal}from"react-dom";// QR code generation via ESM CDN. qrcode-generator is MIT-licensed, ~3KB,
// no API key, no rate limit, no subscription. Pinned to v1.4.4.
// @ts-ignore - external URL import
import qrcode from"https://esm.sh/qrcode-generator@1.4.4";const SMARTCALL_CSS_ID="smartcall-component-styles";const smartcallCss=`
/* ============= Button base ============= */
.sc-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-decoration: none;
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: -0.01em;
    line-height: 1;
    box-sizing: border-box;
    cursor: pointer;
    white-space: nowrap;
    transition:
        background 0.4s cubic-bezier(0.22,1,0.36,1),
        transform 0.3s cubic-bezier(0.22,1,0.36,1),
        box-shadow 0.4s cubic-bezier(0.22,1,0.36,1),
        border-color 0.4s cubic-bezier(0.22,1,0.36,1),
        color 0.3s cubic-bezier(0.22,1,0.36,1);
}
.sc-fullwidth { width: 100%; }

/* Primary — green gradient */
.sc-primary {
    background: linear-gradient(135deg, #2E2920 0%, #16130D 100%);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 6px;
    padding: 13px 22px;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.10);
}
.sc-primary:hover {
    background: linear-gradient(135deg, #3A3427 0%, #201B12 100%);
    border-color: rgba(236, 210, 137, 0.34);
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(46, 44, 40, 0.50), inset 0 1px 0 rgba(255, 255, 255, 0.10);
}

/* Secondary — outline dark */
.sc-secondary {
    background: transparent;
    border: 1px solid rgba(46, 44, 40, 0.40);
    border-radius: 6px;
    padding: 13px 22px;
    color: #2e2c28;
    box-shadow: 0 1px 2px rgba(46, 44, 40, 0.04);
}
.sc-secondary:hover {
    background: linear-gradient(135deg, #2E2920 0%, #16130D 100%);
    border-color: rgba(46, 44, 40, 0.95);
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(46, 44, 40, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.10);
}

/* Badge — pill, dark green */
.sc-badge {
    background: linear-gradient(135deg, #2E2920 0%, #16130D 100%);
    border: 1px solid rgba(236, 210, 137, 0.20);
    border-radius: 999px;
    padding: 14px 22px;
    color: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.10);
}
.sc-badge:hover {
    background: linear-gradient(135deg, #3A3427 0%, #201B12 100%);
    border-color: rgba(236, 210, 137, 0.42);
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(46, 44, 40, 0.50), inset 0 1px 0 rgba(255, 255, 255, 0.10);
}

/* Pulsing dot — can be used on any variant via showPulseDot prop */
.sc-badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ecd289;
    flex-shrink: 0;
    box-shadow: 0 0 0 0 rgba(236, 210, 137, 0.70);
    animation: sc-pulse 1.8s ease-in-out infinite;
}
@keyframes sc-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(236, 210, 137, 0.70); opacity: 1; }
    60%  { box-shadow: 0 0 0 7px rgba(236, 210, 137, 0); opacity: 0.75; }
    100% { box-shadow: 0 0 0 0 rgba(236, 210, 137, 0); opacity: 1; }
}

/* ============= Modal ============= */
.sc-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(11, 10, 9, 0.78);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
    animation: sc-fade 0.35s cubic-bezier(0.22,1,0.36,1) both;
    font-family: Inter, sans-serif;
}
@keyframes sc-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
}

.sc-modal {
    position: relative;
    background: linear-gradient(180deg, #1b1917 0%, #10100f 100%);
    border: 1px solid rgba(255, 255, 255, 0.10);
    border-radius: 18px;
    padding: 36px 36px 32px;
    width: 100%;
    max-width: 440px;
    box-shadow:
        0 28px 80px rgba(0, 0, 0, 0.60),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    color: #ffffff;
    box-sizing: border-box;
    animation: sc-zoom 0.45s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes sc-zoom {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}

.sc-close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.78);
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition:
        background 0.3s cubic-bezier(0.22,1,0.36,1),
        border-color 0.3s cubic-bezier(0.22,1,0.36,1),
        transform 0.4s cubic-bezier(0.22,1,0.36,1),
        color 0.3s cubic-bezier(0.22,1,0.36,1);
}
.sc-close:hover {
    background: rgba(255, 255, 255, 0.10);
    border-color: rgba(236, 210, 137, 0.32);
    color: rgba(241, 222, 169, 0.95);
    transform: rotate(90deg);
}

.sc-eyebrow {
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(241, 222, 169, 0.92);
    line-height: 1;
    margin-bottom: 14px;
}
.sc-heading {
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.02em;
    color: #ffffff;
    line-height: 1.25;
    margin-bottom: 10px;
}
.sc-subcopy {
    font-family: Inter, sans-serif;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.55;
    letter-spacing: -0.01em;
}

.sc-number-wrap {
    margin: 22px 0 6px;
}
.sc-number {
    display: block;
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(236, 210, 137, 0.18);
    border-radius: 12px;
    padding: 20px 16px;
    color: #ffffff;
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 26px;
    letter-spacing: -0.02em;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    transition:
        background 0.3s cubic-bezier(0.22,1,0.36,1),
        border-color 0.3s cubic-bezier(0.22,1,0.36,1);
}
.sc-number:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(236, 210, 137, 0.40);
}
.sc-copy-hint {
    font-family: Inter, sans-serif;
    font-size: 11px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.40);
    margin-top: 10px;
    text-align: center;
    height: 14px;
    transition: color 0.3s cubic-bezier(0.22,1,0.36,1);
}
.sc-copy-hint.sc-copied {
    color: rgba(241, 222, 169, 0.95);
}

.sc-qr-wrap {
    margin-top: 24px;
    padding-top: 22px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}
.sc-qr-frame {
    padding: 12px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.35),
        0 0 0 1px rgba(236, 210, 137, 0.18);
}
.sc-qr-label {
    font-family: Inter, sans-serif;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
    line-height: 1.4;
    letter-spacing: -0.01em;
    text-align: center;
}

@media (prefers-reduced-motion: reduce) {
    .sc-backdrop, .sc-modal { animation: none; }
    .sc-badge-dot { animation: none; }
}
`;function injectSmartCallCss(){if(typeof document==="undefined")return;let tag=document.getElementById(SMARTCALL_CSS_ID);if(!tag){tag=document.createElement("style");tag.id=SMARTCALL_CSS_ID;document.head.appendChild(tag);}if(tag.textContent!==smartcallCss){tag.textContent=smartcallCss;}}/**
 * Device detection. Touch-primary devices get the tel: link directly.
 * Anything else gets the popup. Uses pointer media query as primary signal,
 * which is the modern, correct way (beats UA sniffing for accuracy).
 * Re-evaluates on input mode change (e.g. tablet docked to keyboard).
 */function useIsTouchDevice(){const[isTouch,setIsTouch]=useState(false);useEffect(()=>{if(typeof window==="undefined")return;const evaluate=()=>{const coarse=window.matchMedia("(pointer: coarse)").matches;setIsTouch(coarse);};evaluate();const mq=window.matchMedia("(pointer: coarse)");if(mq.addEventListener){mq.addEventListener("change",evaluate);return()=>mq.removeEventListener("change",evaluate);}else if(mq.addListener){mq.addListener(evaluate);return()=>mq.removeListener(evaluate);}},[]);return isTouch;}function buildTelLink(rawPhone,countryCode){const digits=(rawPhone||"").replace(/\D/g,"");const cc=(countryCode||"").replace(/\D/g,"");if(!digits)return"tel:";if(cc&&digits.startsWith(cc)&&digits.length>10){return`tel:+${digits}`;}if(digits.length===11&&digits.startsWith("1")){return`tel:+${digits}`;}if(digits.length===10&&cc){return`tel:+${cc}${digits}`;}if(digits.length===10){return`tel:+1${digits}`;}return`tel:+${digits}`;}function QRCodeSvg({text,size=180}){const{path,count}=useMemo(()=>{try{const qr=qrcode(0,"M");qr.addData(text);qr.make();const c=qr.getModuleCount();let p="";for(let row=0;row<c;row++){for(let col=0;col<c;col++){if(qr.isDark(row,col)){p+=`M${col} ${row}h1v1h-1z`;}}}return{path:p,count:c};}catch(e){return{path:"",count:21};}},[text]);return /*#__PURE__*/_jsxs("svg",{width:size,height:size,viewBox:`0 0 ${count} ${count}`,xmlns:"http://www.w3.org/2000/svg",shapeRendering:"crispEdges",style:{display:"block"},children:[/*#__PURE__*/_jsx("rect",{width:count,height:count,fill:"#ffffff"}),/*#__PURE__*/_jsx("path",{d:path,fill:"#161514"})]});}function CallModal({phone,telLink,heading,subcopy,qrEnabled,qrCaption,onClose}){const[copied,setCopied]=useState(false);const handleCopyNumber=async()=>{try{await navigator.clipboard.writeText(phone);setCopied(true);window.setTimeout(()=>setCopied(false),2e3);}catch(e){const input=document.createElement("input");input.value=phone;input.style.position="fixed";input.style.opacity="0";document.body.appendChild(input);input.select();try{document.execCommand("copy");setCopied(true);window.setTimeout(()=>setCopied(false),2e3);}catch{}document.body.removeChild(input);}};useEffect(()=>{const onKey=e=>{if(e.key==="Escape")onClose();};const prevOverflow=document.body.style.overflow;document.body.style.overflow="hidden";window.addEventListener("keydown",onKey);return()=>{document.body.style.overflow=prevOverflow;window.removeEventListener("keydown",onKey);};},[onClose]);return /*#__PURE__*/_jsx("div",{className:"sc-backdrop",role:"dialog","aria-modal":"true",onClick:e=>{if(e.target===e.currentTarget)onClose();},children:/*#__PURE__*/_jsxs("div",{className:"sc-modal",children:[/*#__PURE__*/_jsx("button",{type:"button",className:"sc-close","aria-label":"Close",onClick:onClose,children:"\xd7"}),/*#__PURE__*/_jsx("div",{className:"sc-eyebrow",children:"Call or text"}),/*#__PURE__*/_jsx("div",{className:"sc-heading",children:heading}),subcopy?/*#__PURE__*/_jsx("div",{className:"sc-subcopy",children:subcopy}):null,/*#__PURE__*/_jsxs("div",{className:"sc-number-wrap",children:[/*#__PURE__*/_jsx("button",{type:"button",className:"sc-number",onClick:handleCopyNumber,title:"Click to copy",children:phone}),/*#__PURE__*/_jsx("div",{className:`sc-copy-hint${copied?" sc-copied":""}`,children:copied?"Copied to clipboard":"Click to copy"})]}),qrEnabled?/*#__PURE__*/_jsxs("div",{className:"sc-qr-wrap",children:[/*#__PURE__*/_jsx("div",{className:"sc-qr-frame",children:/*#__PURE__*/_jsx(QRCodeSvg,{text:telLink,size:180})}),qrCaption?/*#__PURE__*/_jsx("div",{className:"sc-qr-label",children:qrCaption}):null]}):null]})});}/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */export default function SmartCall({phone,label,countryCode,variant,fullWidth,showPulseDot,popupHeading,popupSubcopy,qrEnabled,qrCaption}){const isTouch=useIsTouchDevice();const[open,setOpen]=useState(false);useEffect(()=>{injectSmartCallCss();},[]);const telLink=useMemo(()=>buildTelLink(phone,countryCode),[phone,countryCode]);// Always render as a tel: link. On desktop, intercept the click and show
// the popup. On mobile, let the browser handle it natively.
const handleClick=e=>{if(!isTouch){e.preventDefault();setOpen(true);}};const classes=["sc-btn",`sc-${variant}`];if(fullWidth)classes.push("sc-fullwidth");// Dot shows on badge variant by default, OR when showPulseDot is explicitly set
const shouldShowDot=variant==="badge"||showPulseDot;return /*#__PURE__*/_jsxs(_Fragment,{children:[/*#__PURE__*/_jsxs("a",{href:telLink,onClick:handleClick,className:classes.join(" "),children:[shouldShowDot?/*#__PURE__*/_jsx("span",{className:"sc-badge-dot","aria-hidden":"true"}):null,label]}),open&&typeof document!=="undefined"?/*#__PURE__*/createPortal(/*#__PURE__*/_jsx(CallModal,{phone:phone,telLink:telLink,heading:popupHeading,subcopy:popupSubcopy,qrEnabled:qrEnabled,qrCaption:qrCaption,onClose:()=>setOpen(false)}),document.body):null]});}SmartCall.defaultProps={phone:"(555) 555-5555",label:"Call (555) 555-5555",countryCode:"1",variant:"primary",fullWidth:false,showPulseDot:false,popupHeading:"Call James Sterling",popupSubcopy:"Click the number to copy it, or scan the QR code with your phone to dial directly.",qrEnabled:true,qrCaption:"Scan with your phone to call"};addPropertyControls(SmartCall,{phone:{type:ControlType.String,defaultValue:"(555) 555-5555",title:"Phone",description:"Displayed as-is. Digits are extracted automatically for the tel: link."},label:{type:ControlType.String,defaultValue:"Call (555) 555-5555",title:"Button Label"},countryCode:{type:ControlType.String,defaultValue:"1",title:"Country Code",description:"Digits only. Defaults to 1 (US/Canada)."},variant:{type:ControlType.Enum,options:["primary","secondary","badge"],optionTitles:["Primary (green gradient)","Secondary (outline)","Badge (pill)"],defaultValue:"primary",title:"Variant"},fullWidth:{type:ControlType.Boolean,defaultValue:false,title:"Full Width",enabledTitle:"On",disabledTitle:"Off"},showPulseDot:{type:ControlType.Boolean,defaultValue:false,title:"Pulse Dot",enabledTitle:"On",disabledTitle:"Off",description:"Show a pulsing green dot before the label. Always on for Badge variant."},popupHeading:{type:ControlType.String,defaultValue:"Call James Sterling",title:"Popup Heading",description:"Shown in the desktop popup."},popupSubcopy:{type:ControlType.String,defaultValue:"Click the number to copy it, or scan the QR code with your phone to dial directly.",title:"Popup Subcopy",displayTextArea:true},qrEnabled:{type:ControlType.Boolean,defaultValue:true,title:"Show QR Code",enabledTitle:"On",disabledTitle:"Off"},qrCaption:{type:ControlType.String,defaultValue:"Scan with your phone to call",title:"QR Caption"}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"SmartCall","slots":[],"annotations":{"framerContractVersion":"1","framerSupportedLayoutWidth":"auto","framerSupportedLayoutHeight":"auto"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./SmartCall.map