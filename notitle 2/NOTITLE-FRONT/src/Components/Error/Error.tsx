import { FC, ReactElement } from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }): ReactElement => (
  // <div>{message}</div>
  <></>
);

export default ErrorMessage;
