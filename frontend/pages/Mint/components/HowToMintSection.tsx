interface HowToMintSectionProps {}

export const HowToMintSection: React.FC<HowToMintSectionProps> = () => {
  return (
    <section className="how-to-mint-container px-4 text-center max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg border-2 border-black shadow-lg">
      <h2 className="heading-md">How to Create & Mint</h2>

      <ol className="flex flex-col md:flex-row items-center md:justify-between pt-6 gap-6">
        {[
          "Connect Your Wallet",
          "Tear a page from ledger",
          "Add your creation to the page",
          "Confirm with 📒",
          "Join Community",
        ].map((text, index) => (
          <li key={index} className="flex items-center gap-4 basis-1/5">
            <span className="title-md text-secondary-text">{index + 1}</span>
            <p className="body-sm text-left">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};
