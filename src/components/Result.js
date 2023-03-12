import { Link } from "react-router-dom";


const Result = (props) => {

    const {message } = props ;

    return(
        <div className="result-div">
            <Link to={'/'}><span>Go Back ! try again</span></Link>
            <h3>{message}</h3>
            
            {props.show && <div>
                <h5>time taken: {props.totaltime}</h5>
                <h5>Planet name: {props.pname}</h5>
            </div>}
        </div>
    )
}


export default Result;