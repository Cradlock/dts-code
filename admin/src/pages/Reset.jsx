import { useContext } from "react";
import { AuthContext } from "../auth";
import Load from "../components/Load";
import Not403 from "../components/not403";

const Reset = () => {
    const { info,loading } = useContext(AuthContext);

    if(loading) return <Load />;
    if(!info) return <Not403 />;

    return (
        <div className="reset-container">

        </div>

    );
}

export default Reset