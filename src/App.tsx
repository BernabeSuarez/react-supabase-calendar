import "./App.css";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { IEvent } from "./interfaces/IEvent";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function App() {
  const session = useSession(); //tokens si hay una sesion iniciada hay un usuario
  const supabase = useSupabaseClient(); //comunicarse con supabase
  const { isLoading } = useSessionContext(); //esperar que cargue el login para renderizar la pagina
  const [start, setStart] = useState<ValuePiece>(new Date());
  const [end, setEnd] = useState<Value>(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });

    //colocar un toast
    if (error) {
      alert("Error al registrarse con Google");
      console.log(error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    //Colocar un Toast
  };
  // console.log(session); ver toda la info que trae la autenticacion para usar luego
  const createCalendarEvent = async () => {
    const event: IEvent = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(), //"2023-10-18T19:00:00",
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: end.toISOString(), //"2023-10-18T20:00:00",
        timeZone: "America/Los_Angeles",
      },
    };

    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session?.provider_token, //token de acceso a google
        },

        body: JSON.stringify(event), //convierte a string el evento creado
      }
    )
      .then((data) => data.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    alert("Evento creado OK");
    console.log(start, end);
  };
  return (
    <>
      <main>
        <h1>React app Google Calendar</h1>
        {session ? (
          <>
            <h2>Hola, {session.user.email}, bienvenido</h2>
            <p>Nombre del Evento</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Descripcion del Evento</p>
            <input
              type="text"
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <p>el evento comienza</p>
            <DateTimePicker onChange={setStart} value={start} />
            {/* <input
              type="datetime-local"
              onChange={(e) => setStart(e.target.value)}
              value={start}
            /> */}

            <p>El evento termina</p>
            <DateTimePicker onChange={setEnd} value={end} />
            {/* <input
              type="datetime-local"
              onChange={(e) => setEnd(e.target.value)}
              value={end}
            /> */}
            <br />
            <button onClick={createCalendarEvent}>Crear Evento</button>
            <button onClick={signOut}>Salir</button>
          </>
        ) : (
          <>
            <button onClick={googleSignIn}>Entrar con Google</button>
          </>
        )}
      </main>
    </>
  );
}

export default App;
