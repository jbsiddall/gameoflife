const ADDRESS = 'http://localhost:5000';

export interface Game {
  id: string;
  name: string;
}

export const getAllGames = async (): Promise<Game[]> => {
  const response = await fetch(`${ADDRESS}/games`);
  return response.json();
};

export const createGame = async (name: string): Promise<Game> => {
  const response = await fetch(`${ADDRESS}/games`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name})
  });
  return response.json();
};
