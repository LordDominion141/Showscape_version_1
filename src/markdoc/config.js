// 1. IMPORT BASETAGS
import { baseTags } from "@/markdoc/BaseTags";

// 2. IMPORT THE COMPONENTS
import Callout from '@/markdoc/components/Callout';
import Tabs from "@/markdoc/components/Tabs";
import CodeGroup from "@/markdoc/components/CodeGroup";
import Diagram from "@/markdoc/components/Diagram";
import Steps from "@/markdoc/components/Steps";
import ApiReference from "@/markdoc/components/ApiReference";

// 3. CREATE YOUR CONFIG
export const config = {
    tags: {
        ...baseTags,
    },
};

// 4. EXPORT THE COMPONENTS OBJECT
export const components = {
    Callout,
    Tabs,
    CodeGroup,
    Diagram,
    Steps,
    ApiReference,
};