import React, { useEffect, useState } from 'react';
import useForceUpdate from 'use-force-update';
import { Link } from 'react-router-dom';


function Home(props) {

  const [planets , setPlanets] = useState([]);                                                 //all planets data in array
  const [selectedplanet , setSelectedPlanet] = useState([]);                                   //selected planets by user in array
  const [vehicles , setVehicles] = useState([]);                                               // all vehicles data in array  
  const [selectedvehicle , setSelectedVehicle] = useState([]);                                 //selected vehicles by user in array
  const [time , setTime] = useState(0);
  const [token , setToken] = useState({});
  var result = {};
  const forceUpdate = useForceUpdate();

  const { setMessage} = props ;




  // Initially , I gather all planets details & stored in planets array ...... also gets all vehicles details in vehicles array
  useEffect(()=>{
    fetch("https://findfalcone.geektrust.com/planets")
    .then(res => res.json())
    .then((data) => {
      setPlanets(data);
    });

    fetch("https://findfalcone.geektrust.com/vehicles")    
    .then(res => res.json())
    .then((data) => {
      setVehicles(data);
    })
  } , [])




  //update the selected vehicles array when clicked
  const updateVehicles = (data , d) => {
    if(data !== "none"){
      selectedvehicle.forEach((item) => {                              //it searchs the already present item and deleted it
        if(item.id === d && item.total_no === 0){
          const e = selectedvehicle.indexOf(item);
          selectedvehicle.splice(e,1);
          setSelectedVehicle(selectedvehicle);
        }
      })
      // this one loop is used to fill the empty 'selectedplanet' array with selected object
      vehicles.forEach((vehicle) => 
       { if(vehicle.name === data){
          if(vehicle.total_no > 0){
            vehicle.id = d ;
            vehicle.total_no = vehicle.total_no - 1;
            selectedvehicle.push(vehicle);
            console.log("index of vehicle data : "  , selectedvehicle.indexOf(vehicle));
          }
        }}
      )
      console.log("selected vehicle data : " , selectedvehicle ,"main vehicle-", vehicles);
      forceUpdate();                                                                             //used to update the latest changes
    }
  }




    
  // Update the selected planets array when clicked
  const updatePlanets = (data ,d) => {                              
    // e.preventDefault();  
   if(data !== "none")
   {
    selectedplanet.forEach((item) => {                              //it searchs the already present item and deleted it
      if(item.id === d){
        const e = selectedplanet.indexOf(item);
        selectedplanet.splice(e,1);
        setSelectedPlanet(selectedplanet);
      }
    })
    // this one loop is used to fill the empty 'selectedplanet' array with selected object
    planets.forEach((planet) => 
     { if(planet.name === data){
        if(selectedplanet.indexOf(planet) === -1){
          planet.id = d ;
          selectedplanet.push(planet);
          console.log("index of data : "  , selectedplanet.indexOf(planet));
        }
      }}
    )
    console.log("selected planet data : " , selectedplanet ,selectedplanet.length);
   }
  }

  const submitted = async() => {
  
    // Simple POST request with a JSON body using fetch  ... get the token
    const requestOptions = {
      method: 'POST',
      headers: { 'Accept': 'application/json' }    
    };

    await fetch('https://findfalcone.geektrust.com/token', requestOptions)
        .then(response => response.json())
        .then(data => {
          token.token = data.token;
          setToken(token);
          console.log("++++++++",token);
    });

  goToResult(token);
  
  }


  const goToResult = async(token) => {
    const planteName = [];
    selectedplanet.forEach(planet => {
     planteName.push(planet.name);
    })     
 
    const vehicleName = [];
    selectedvehicle.forEach(vehicle => {
     vehicleName.push(vehicle.name);
    }) 

    //Now using selected planet and selected vehicle, check the result and get the response accordingly 
   const reqOpt = {
    method: 'POST',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    body: await JSON.stringify({token: token.token, 
    "planet_names": planteName,
    "vehicle_names": vehicleName})
   }
   await fetch('https://findfalcone.geektrust.com/find' , reqOpt)
   .then(res => res.json())  
   .then(data => {
    result = data;
    console.log("----Result----",data ,result);
   }).catch(err => {
    console.log("Error----",err);
  })

  // check condition for status 
  if(result.status === "success" ){
    calTheTime(result.planet_name);
    setMessage('Success! Congratulations on Finding Falcone , King Shan is mighty Pleased');
    props.setShow(true);
  }else if(result.status === "false"){
    setMessage('You missed this time! try again');
  }

  }

// function to calculate the time
  const calTheTime = async (planet_name) => {
    var dis = 0;
    var speed = 0;
    var id = -1 ;
    await selectedplanet.forEach((item) => {                      //distance of planet                   
      if(item.name === planet_name){
        dis = item.distance;
        id = item.id;
        console.log('distance of planet' , dis);
      }
    })
    props.setPname(planet_name);

    await selectedvehicle.forEach((item) => {                      //speed of planet                   
      if(item.id === id){
        speed = item.speed ;
        console.log('speed of vehicle' , speed);
      }
    })

    //calculate the time
    const ans = dis / speed ;
    console.log('ans' , ans);
    setTime(ans);
    props.setTotalTime(ans);
  }



  return (
    <div className="Home">
      <p>Select planets you want to search in :</p>

      <div>
        <div className='planets-div'>

          {/* first planet */}
          <div className='each-planet-div'>
            <p id="destination">Destination 1</p>
            <select name="destination1" onChange={(e) => updatePlanets(e.target.value ,1)}>
              <option value="none" hidden>Select</option>
              {planets.map((planet) => 
              <option value={planet.name}>{planet.name}</option>
              )}
            </select>

            {/* choose a vehcile from this list*/}
            <div>
              <p id="vehicle">Choose a vehicle :</p>
              <select name="vehicle1" onChange={(e) => updateVehicles(e.target.value ,1)}>
                <option value="none" hidden>Select</option>
                {vehicles.map((vehicle) => 
                <option value={vehicle.name}>{vehicle.name} {(vehicle.total_no !== 0) ? (vehicle.total_no) : (0)}</option>
                )}
              </select> 
            </div>

          </div>

          {/* second planet */}
          <div className='each-planet-div'>
            <p id="destination">Destination 2</p>
            <select name="destination2" onChange={(e) => updatePlanets(e.target.value ,2 )}>
              <option value="none" hidden>Select</option>
              {planets.map((planet) => 
              <option value={planet.name}>{planet.name}</option>
              )}
            </select>

            {/* choose a vehcile from this list*/}
            <p id="vehicle">Choose a vehicle :</p>
            <select name="vehicle2" onChange={(e) => updateVehicles(e.target.value ,2)}>
              <option value="none" hidden>Select</option>
              {vehicles.map((vehicle) => 
              <option value={vehicle.name}>{vehicle.name} ({vehicle.total_no})</option>
              )}
            </select>
          </div>  

          {/* third planet */}
          <div className='each-planet-div'>
            <p id="destination">Destination 3</p>
            <select name="destination3" onChange={(e) => updatePlanets(e.target.value ,3)}>
              <option value="none" hidden>Select</option>
              {planets.map((planet) => 
              <option value={planet.name}>{planet.name}</option>
              )}
            </select>


            {/* choose a vehcile from this list*/}
            <p id="vehicle">Choose a vehicle :</p>
            <select name="vehicle3" onChange={(e) => updateVehicles(e.target.value ,3)}>
              <option value="none" hidden>Select</option>
              {vehicles.map((vehicle) => 
              <option value={vehicle.name}>{vehicle.name} ({vehicle.total_no})</option>
              )}
            </select>
          </div>

          {/* fourth planet */}
          <div className='each-planet-div'>
            <p id="destination">Destination 4</p>
            <select name="destination4" onChange={(e) => updatePlanets(e.target.value, 4)}>
              <option value="none" hidden>Select</option>
              {planets.map((planet) => 
              <option value={planet.name}>{planet.name}</option>
              )}
            </select> 

            
            {/* choose a vehcile from this list*/}
            <p id="vehicle">Choose a vehicle :</p>
            <select name="vehicle4" onChange={(e) => updateVehicles(e.target.value ,4)}>
              <option value="none" hidden>Select</option>
              {vehicles.map((vehicle) => 
              <option value={vehicle.name}>{vehicle.name} ({vehicle.total_no})</option>
              )}
            </select>
          </div>   

        </div>


      <Link to={'/result'}><button type="submit" onClick={() => submitted()}>Find Falcone</button></Link>

        <h5>Time taken : {time}</h5>
      </div>
    </div>
  );
}

export default Home;