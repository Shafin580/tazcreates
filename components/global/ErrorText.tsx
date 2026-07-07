import { cn } from "@/lib/utils";
import { useId } from "react";

export interface ErrorTextProps {
  text?: string;
  className?: string;
  id?: string;
}

/**
 * Error Text for Form Fields
 *
 * @description
 * Company - ARITS Ltd. 4th Jan 2023
 *
 * This component is used to render an error text on a form field
 * @param {string}  text The error text
 * @param {string}  className The class of the error text
 * @param {string}  id Optional custom id — pass the same value to `aria-describedby` on the input
 */

const ErrorText = ({ text, className, id }: ErrorTextProps) => {
  const autoId = useId();
  const errorId = id ?? `error-${autoId}`;
  return (
    <p className={cn("text-destructive text-sm", className)} id={errorId} role="alert">
      {text}
    </p>
  );
};

export default ErrorText;
