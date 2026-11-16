interface SectionHeaderProps {
  section: string;
  title: string;
  content: string;
  variant?: "default" | "light" | "dark";
}

const SectionHeader = ({ section, title, content, variant = "default" }: SectionHeaderProps) => {
  const styles: Record<string, Record<string, string>> = {
    default: {
      section: "text-xl text-gray-500 mb-2",
      title:
        "text-2xl md:text-5xl font-semibold text-primary mb-4 w-3/4 mx-auto leading-snug",
      content: "text-gray-600 max-w-2xl mx-auto mb-12",
    },
    light: {
      section: "text-xl text-white/70 mb-2",
      title:
        "text-2xl md:text-5xl font-semibold text-white mb-4 w-3/4 mx-auto leading-snug",
      content: "text-white/90 max-w-2xl mx-auto mb-12",
    },
    dark: {
      section: "text-xl text-gray-300 mb-2",
      title:
        "text-2xl md:text-5xl font-semibold text-gray-100 mb-4 w-3/4 mx-auto leading-snug",
      content: "text-gray-400 max-w-2xl mx-auto mb-12",
    },
  };

  return (
    <div className="text-center">
      <h5 className={styles[variant].section}>{section}</h5>
      <h2 className={styles[variant].title}>{title}</h2>
      <p className={styles[variant].content}>{content}</p>
    </div>
  );
};

export default SectionHeader;
