import { Result } from "antd"

const ErrorPage = ({ statusCode, errorTitle, subTitle }) => {
    const backToHomePage = <p><a href="/">Click here</a> to go back to the home page</p>

    return (<Result
        status={statusCode}
        title={errorTitle}
        subTitle={subTitle}
        extra={backToHomePage}
    />);
}

export default ErrorPage;