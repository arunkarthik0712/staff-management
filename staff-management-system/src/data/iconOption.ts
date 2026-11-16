import * as icons from "react-icons/lu";
let cachedIconOptions: any[] | null = null;

export const Icons: Record<string, any> = { ...icons };

export const iconOptions = () => {
  if (cachedIconOptions) return cachedIconOptions;

  cachedIconOptions = Object.keys(Icons).map((iconName) => ({
    label: iconName,
    value: iconName,
    icon: Icons[iconName],
  }));

  return cachedIconOptions;
};
