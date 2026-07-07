"use client";

import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Label } from "../ui/label";
import { useQaId } from "@/hooks/use-qa-id";
import { cn } from "@/lib/utils";
import { CountryData } from "react-phone-input-2";
import { isValidPhoneNumber, CountryCode } from "libphonenumber-js";

interface PhoneInputProps {
  label?: string;
  required?: boolean;
  value?: string;
  onChange: (
    value: string,
    country: CountryData,
    e: React.ChangeEvent<HTMLInputElement>,
    isValid: boolean
  ) => void;
  error?: string;
  className?: string;
  placeholder?: string;
  qaNamespace?: string;
}

export default function PhoneNumberInputField({
  label = "Phone Number",
  required = true,
  value = "",
  onChange,
  error: externalError,
  className,
  placeholder = "Enter phone number",
  qaNamespace = "contact-form.phone"
}: PhoneInputProps) {
  const phone = useQaId(qaNamespace);
  const [phoneValue, setPhoneValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);
  const [countryData, setCountryData] = useState<CountryData | null>(null);

  // + Function To Validation Phone Number
  const validatePhoneNumber = (
    phoneNumber: string,
    countryCode: CountryCode,
    required: boolean
  ): { status: boolean; message: string } => {
    if (!required && !phoneValue) {
      return { status: true, message: "" };
    } else {
      if (phoneNumber?.trim().length === 0) {
        return { status: false, message: "Phone number is required" };
      } else {
        if (isValidPhoneNumber(phoneNumber, countryCode)) {
          return { status: true, message: "" };
        } else {
          return { status: false, message: "Invalid phone number!" };
        }
      }
    }
  };

  // Error message generator
  const getErrorMessage = () => {
    if (externalError) return externalError; // Prioritize external error
    if (!touched || isValid) return null;

    if (!phoneValue && required) {
      return "Phone number is required";
    }

    const valid = validatePhoneNumber(
      phoneValue,
      countryData?.countryCode.toLocaleUpperCase() as CountryCode,
      required
    );
    if (valid.status === false) {
      return valid.message;
    }
  };

  // + Function To Track Changes in input field
  const handleChange = (
    val: string,
    country: CountryData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneValue(val);
    setTouched(true);
    setCountryData(country);

    const valid = validatePhoneNumber(
      val,
      country.countryCode.toLocaleUpperCase() as CountryCode,
      required
    );
    setIsValid(valid.status);

    onChange(val, country, e, valid.status); // Pass validation status
  };

  useEffect(() => {
    setPhoneValue(value);
  }, [value]);

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label htmlFor={phone.id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="custom-phone-input">
        <PhoneInput
          country={"bd"}
          value={phoneValue}
          onChange={handleChange}
          enableSearch={true}
          searchPlaceholder="Search countries..."
          inputProps={{
            id: phone.id,
            "data-qa": phone["data-qa"],
            "aria-label": label,
            required,
            placeholder
          }}
          containerClass={cn("w-full", !isValid && touched && "ring-2 ring-destructive")}
          inputClass={cn(
            "w-full rounded-md border border-gray-300 placeholder-gray-400",
            "md:text-sm text-base placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-input/30 bg-transparent"
          )}
          buttonClass={cn(
            "absolute left-0 top-0 h-10 rounded-l-md border border-gray-300 bg-gray-100",
            "flex items-center justify-center px-3"
          )}
          dropdownClass="border border-gray-300 rounded-md shadow-md overflow-y-auto"
        />

        {/* <style jsx global>{`
          .react-tel-input .form-control {
            height: 2.25rem !important;
            width: 100% !important;
          }

          html[style*="color-scheme: dark"] .react-tel-input .form-control {
            background-color: hsl(240 10% 3.9%) !important;
          }

          .react-tel-input .flag-dropdown {
            height: 2.25rem !important;
            border-right: none !important;
          }

          html[style*="color-scheme: dark"] .react-tel-input .selected-flag {
            background-color: #1d1f1f !important;
          }

          .react-tel-input .selected-flag {
            height: 2.15rem !important;
            display: flex !important;
            align-items: center !important;
          }

          .react-tel-input .country-list {
            max-height: 300px !important;
            overflow-y: auto !important;
            width: 300px !important;
            margin-top: 0 !important;
            top: 40px !important;
            left: 0 !important;
            z-index: 50 !important;
          }

          html[style*="color-scheme: dark"] .react-tel-input .country-list {
            background-color: black !important;
          }

          .react-tel-input .search-box {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 4px !important;
            padding-left: 25px !important;
          }

          .react-tel-input .search {
            position: relative;
          }

          html[style*="color-scheme: dark"] .react-tel-input .search {
            background-color: black !important;
          }

          html[style*="color-scheme: dark"] .react-tel-input .country.highlight {
            background-color: grey !important;
          }

          html[style*="color-scheme: dark"] .react-tel-input .country.highlight .dial-code {
            color: white !important;
          }

          html[style*="color-scheme: dark"] .react-tel-input .country .dial-code {
            color: white !important;
          }

          html[style*="color-scheme: dark"] .react-tel-input .country:hover {
            background-color: grey !important;
          }

          .react-tel-input .search-emoji {
            position: absolute;
            left: 14px;
            top: 55%;
            transform: translateY(-50%);
            pointer-events: none;
          }
        `}</style> */}
      </div>

      {getErrorMessage && <p className="text-destructive text-sm">{getErrorMessage()}</p>}
    </div>
  );
}
