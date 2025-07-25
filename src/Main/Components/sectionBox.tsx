type SectionBoxProps = {
  title: string;
  children: React.ReactNode;
  sectionClassName?: string; // class for wrapper (title + box)
  boxClassName?: string;     // class just for the box
};

function sectionBox({ title, children, sectionClassName, boxClassName }: SectionBoxProps) {
  return (
    <div className={`section-wrapper ${sectionClassName ?? ""}`}>
      <h3 className="section-title">{title}</h3>
      <div className={`section-box ${boxClassName ?? ""}`}>
        {children}
      </div>
    </div>
  );
}

export default sectionBox;