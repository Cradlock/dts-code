import{ useContext,useState,useEffect, createContext } from "react";






export const EventContext = createContext();

export const EventProvider = ({ children } ) => {
    const [ events,setEvents ] = useState([]);

    const [ event_loading,setEventLoading ] = useState(true);
    

    useEffect(
        () => {
            async function fetchRequest() {
                try{
                    const response = await fetch(`${process.env.REACT_APP_API}/admin_api/events/`, { method:"GET",credentials:"include" }) 
                    const data = await response.json();
                    setEvents(data); 
                }catch(error){
                    console.log(error);
                }finally{
                    setEventLoading(false);
                }
            }
            
            fetchRequest();
            return () => {

            };
        },[]
    )

    return (
        <EventContext.Provider value={{ events,event_loading,setEventLoading,setEvents }} >
              {children}
        </EventContext.Provider>
    )
}
