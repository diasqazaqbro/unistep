import { FC } from "react";

type ToastProps = {
  title: string;
  text?: string;
  action?: () => void;
};

const Toast: FC<ToastProps> = ({ title, text }) => {
  return (
    <div className="p-4 rounded-xl  max-w-md w-full">
      <div className="flex justify-between items-start">
        <p className="text-base font-medium text-gray-900 break-words">
          {title}
        </p>
        <button className="ml-4 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.023 6.023a.625.625 0 0 1 .884 0l7.07 7.07a.625.625 0 0 1-.883.884l-7.071-7.07a.625.625 0 0 1 0-.884Z"
              fill="#AFB5C0"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.977 6.023a.625.625 0 0 1 0 .883l-7.071 7.071a.625.625 0 0 1-.884-.883l7.071-7.071a.625.625 0 0 1 .884 0Z"
              fill="#AFB5C0"
            />
          </svg>
        </button>
      </div>

      {text && <p className="mt-2 text-sm text-gray-700 break-words">{text}</p>}
    </div>
  );
};

export default Toast;
