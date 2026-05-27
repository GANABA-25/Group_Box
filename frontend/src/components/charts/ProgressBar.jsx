import React from "react";

const ProgressBar = React.forwardRef(
  (
    {
      value = 0,
      max = 100,
      label,
      showAnimation = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const safeValue = Math.min(max, Math.max(value, 0));
    const progressWidth = max ? `${(safeValue / max) * 100}%` : `${safeValue}%`;

    const labelPercentage = (value / max) * 100;

    let variant = "neutral";
    if (labelPercentage >= 70) {
      variant = "success";
    } else if (labelPercentage === 50) {
      variant = "neutral";
    } else if (labelPercentage < 50) {
      variant = "warning";
    }

    const variantStyles = {
      neutral: {
        background: "bg-blue-200 dark:bg-blue-500/40",
        bar: "bg-blue-500 dark:bg-blue-500",
      },
      warning: {
        background: "bg-red-200 dark:bg-red-500/30",
        bar: "bg-red-500 dark:bg-red-500",
      },
      success: {
        background: "bg-emerald-200 dark:bg-emerald-500/30",
        bar: "bg-emerald-500 dark:bg-emerald-500",
      },
    };

    const { background, bar } = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={`flex w-full items-center ${className}`}
        role="progressbar"
        aria-label="Progress bar"
        aria-valuenow={value}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={`relative flex h-[0.38rem] w-full items-center rounded-full ${background}`}
        >
          <div
            className={`h-full rounded-full ${bar} ${
              showAnimation
                ? "transition-all duration-300 ease-in-out transform-gpu"
                : ""
            }`}
            style={{ width: progressWidth }}
          />
        </div>

        {label && (
          <span className="ml-2 whitespace-nowrap text-sm font-medium leading-none text-gray-900 dark:text-gray-50">
            {label}
          </span>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
