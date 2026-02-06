import {IonPage,IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonItem,IonAvatar,IonLabel,IonCard,IonCardContent,IonLoading,IonText,IonBadge} from "@ionic/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Character {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  createdAt: string;
  image: string;
}

interface ApiResponse {
  items: Character[];
}

/* =============================
   Home
============================= */

const FALLBACK_IMAGE = "/futurama-logo.png";

const Home: React.FC = () => {

  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* =============================
     LLAMADA A LA API
  ============================= */

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await axios.get<ApiResponse>(
        "https://futuramaapi.com/api/characters",
        {
          timeout: 8000,
          params: {
            orderBy: "id",
            orderByDirection: "asc",
            page: 1,
            size: 50
          }
        }
      );

      setCharacters(response.data.items);

    } catch (err) {
      console.error("API error:", err);
      setErrorMessage("No se pudieron cargar los personajes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Personajes de Futurama</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonLoading isOpen={isLoading} message="Cargando personajes..." />

        {errorMessage && (
          <IonText color="danger">
            <h2>{errorMessage}</h2>
          </IonText>
        )}

        {!isLoading && characters.length === 0 && !errorMessage && (
          <IonText>
            <h2>No hay personajes para mostrar.</h2>
          </IonText>
        )}

        <IonList>

          {characters.map((character) => (

            <IonCard key={character.id}>

              <IonCardContent>

                <IonItem lines="none">

                  <IonAvatar slot="start">
                    <img
                      src={character.image && character.image.trim() !== ""
                        ? character.image
                        : FALLBACK_IMAGE
                      }
                      alt={character.name}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;

                        // evita loop infinito
                        if (!img.src.includes(FALLBACK_IMAGE)) {
                          img.src = FALLBACK_IMAGE;
                        }
                      }}
                    />
                  </IonAvatar>

                  <IonLabel>
                    <h2>{character.name}</h2>
                    <p>Género: {character.gender}</p>
                    <p>Estado: {character.status}</p>
                    <p>Especie: {character.species}</p>
                  </IonLabel>

                  <IonBadge
                    color={
                      character.status === "ALIVE"
                        ? "success"
                        : character.status === "DEAD"
                        ? "danger"
                        : "medium"
                    }
                  >
                    {character.status}
                  </IonBadge>

                </IonItem>

              </IonCardContent>

            </IonCard>

          ))}

        </IonList>

      </IonContent>

    </IonPage>
  );
};

export default Home;
