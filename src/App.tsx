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
  const [start, setStart] = useState<Value>(new Date());
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
      .catch((err) => console.log(err));

    alert("Evento creado OK");
  };
  return (
    <>
      <main className="bg-zinc-800 p-6 h-screen flex flex-col items-center">
        <h1 className="text-center text-5xl text-white ">
          React app Google Calendar
        </h1>
        {session ? (
          <>
            <main className="min-h-screen flex items-center justify-center">
              <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2>Hola, {session.user.email}, bienvenido</h2>
                <p>Nombre del Evento</p>
                <input
                  type="text"
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p>Descripcion del Evento</p>
                <input
                  type="text"
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p>el evento comienza</p>
                <DateTimePicker onChange={setStart} value={start} />

                <p>El evento termina</p>
                <DateTimePicker onChange={setEnd} value={end} />

                <br />
                <button
                  onClick={createCalendarEvent}
                  className="border border-teal-500 bg-teal-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-teal-600 focus:outline-none focus:shadow-outline"
                >
                  Crear Evento
                </button>
                <button
                  onClick={signOut}
                  className="border border-teal-500 bg-teal-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-teal-600 focus:outline-none focus:shadow-outline"
                >
                  Salir
                </button>
              </div>
            </main>
          </>
        ) : (
          <>
            <button
              onClick={googleSignIn}
              className="border border-teal-500 bg-teal-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-teal-600 focus:outline-none focus:shadow-outline"
            >
              Entrar con Google
            </button>
          </>
        )}
      </main>
    </>
  );
}

export default App;
