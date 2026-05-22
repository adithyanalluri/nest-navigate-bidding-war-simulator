const steps = ["Review Home", "Build Offer", "Seller Review", "Result"];

function ProgressBar({ currentStep = 1 }) {
  return (
    <div className="progress-panel" aria-label="Game progress">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        return (
          <div className="progress-step" key={step}>
            <span className={isActive ? "step-dot active" : "step-dot"}>{stepNumber}</span>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ProgressBar;
