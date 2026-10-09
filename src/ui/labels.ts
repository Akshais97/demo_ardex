export const labels = {
 en:{workspace:'Workspace', readiness:'Runtime readiness', scope:'Build scope', applicator:'Applicator', homeowner:'Homeowner', admin:'Ardex control', home:'Home', jobs:'Jobs', rewards:'Rewards', profile:'Profile', accept:'Accept visit', diagnose:'Site diagnosis', quote:'Send quote', scan:'Scan product', handover:'Handover'},
 hi:{workspace:'कार्य क्षेत्र', readiness:'तैयारी की जाँच', scope:'निर्माण योजना', applicator:'एप्लिकेटर', homeowner:'गृहस्वामी', admin:'आर्डेक्स नियंत्रण', home:'होम', jobs:'काम', rewards:'अंक', profile:'प्रोफ़ाइल', accept:'विज़िट स्वीकार करें', diagnose:'साइट जाँच', quote:'कोटेशन भेजें', scan:'उत्पाद स्कैन करें', handover:'हस्तांतरण'},
 kn:{workspace:'ಕಾರ್ಯಕ್ಷೇತ್ರ', readiness:'ಸಿದ್ಧತೆ ಪರಿಶೀಲನೆ', scope:'ನಿರ್ಮಾಣ ಯೋಜನೆ', applicator:'ಅಪ್ಲಿಕೇಟರ್', homeowner:'ಮನೆ ಮಾಲೀಕರು', admin:'ಆರ್ಡೆಕ್ಸ್ ನಿಯಂತ್ರಣ', home:'ಮುಖಪುಟ', jobs:'ಕೆಲಸಗಳು', rewards:'ಅಂಕಗಳು', profile:'ಪ್ರೊಫೈಲ್', accept:'ಭೇಟಿ ಸ್ವೀಕರಿಸಿ', diagnose:'ಸ್ಥಳ ಪರಿಶೀಲನೆ', quote:'ದರಪಟ್ಟಿ ಕಳುಹಿಸಿ', scan:'ಉತ್ಪನ್ನ ಸ್ಕ್ಯಾನ್', handover:'ಹಸ್ತಾಂತರ'}
};
export type Language = keyof typeof labels;
export const localisedNumber = (number:number, language:Language) => new Intl.NumberFormat({en:'en-IN',hi:'hi-IN',kn:'kn-IN'}[language]).format(number);
// Hindi/Kannada are an unreviewed demonstration subset. Detailed guidance stays in English.
