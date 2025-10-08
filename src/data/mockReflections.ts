import type { Reflection } from "../types/Reflection";
import { v4 as uuidv4 } from "uuid";

export const mockReflections: Reflection[] = [
  {
    id: uuidv4(),
    title: "[USER GUIDE] Welcome to Reflections",
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    content: `- Click on the body (me) or the title to start editing.
    
- When you're done, click on the side menu or on a Reflection in the menu to exit. Your changes are automatically saved.
    
- Click on a Reflection in the side menu to select and view it. A selected Reflection will be highlighted.
    
- To delete a selected Reflection, click on it and click delete.
    
- To create a new Reflection, either click on the Add Reflection button or click on the header or body sections when empty.
    `.trim(),
  },
];
