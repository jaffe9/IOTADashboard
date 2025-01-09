
import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';

export default function ChipsDemo() {
    const [selectedLanguage, setSelectedLanguage] = useState();
    const Languages = [
        { name: 'Bahasa Indonesia - Indonesian', code: 'NY' },
        { name: 'Bahasa Melayu - Malay', code: 'RM' },
        { name: 'Català - Catalan', code: 'LDN' },
        { name: 'Čeština - Czech', code: 'IST' },
        { name: 'Dansk - Danish', code: 'PRS' },
        { name: 'Deutsch - German', code: 'IST' },
        { name: 'English', code: 'IST' },
        { name: 'English UK - British English', code: 'IST' },
        { name: 'Euskara - Basque (beta)', code: 'IST' },
        { name: 'Filipino', code: 'IST' },
        { name: 'Français - French', code: 'IST' },
        { name: 'Gaeilge - Irish (beta)', code: 'IST' },
        { name: 'Galego - Galician (beta)', code: 'IST' },
        { name: 'Hrvatski - Croatian', code: 'IST' },
        { name: 'Italiano - Italian', code: 'IST' },
        { name: 'Magyar - Hungarian', code: 'IST' },
        { name: 'ederlands - Dutch', code: 'IST' },
        { name: 'Norsk - Norwegian', code: 'IST' },
        { name: 'Polski - Polish', code: 'IST' },
        { name: 'Português - Portuguese', code: 'IST' },
        { name: 'Română - Romanian', code: 'IST' },
        { name: 'Slovenčina - Slovak', code: 'IST' },
        { name: 'Suomi - Finnish', code: 'IST' },
        { name: 'Svenska - Swedish', code: 'IST' },
        { name: 'Tiếng Việt - Vietnamese', code: 'IST' },
        { name: 'Türkçe - Turkish', code: 'IST' },
        { name: 'Ελληνικά - Greek', code: 'IST' },
        { name: 'Български език - Bulgarian', code: 'IST' },
        { name: 'Русский - Russian', code: 'IST' },
        { name: 'Српски - Serbian', code: 'IST' },
        { name: 'Українська мова - Ukrainian', code: 'IST' },
        { name: 'עִבְרִית - Hebrew', code: 'IST' },
        { name: 'اردو - Urdu (beta), code: IST' },
        { name: '>العربية - Arabic', code: 'IST' },
        { name: '>فارسی - Persian', code: 'IST' },
        { name: 'मराठी - Marathi'},
        { name:'Hindiहिन्दी - Hindi'},
        { name:'বাংলা - Bangla'},
        { name:'ગુજરાતી - Gujarati'},
        { name: 'தமிழ் - Tamil'},
        { name:'ಕನ್ನಡ - Kannada'},
        { name:'ภาษาไทย - Thai'},
        { name:'한국어 - Korean'},
        { name:'日本語 - Japanese'},
        { name:'简体中文 - Simplified Chinese'},
        { name: '繁體中文 - Traditional Chinese'}

    ];

    return (
        <div className="">
            <MultiSelect value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.value)} options={Languages} optionLabel="name" display="chip" 
                placeholder="Select Languages"
                maxSelectedLabels={3}
                className="form-select form-select-lg form-select-solid" />
        </div>
    );
}
      
export {ChipsDemo};