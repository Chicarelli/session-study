interface LogarDTO {
  positions: string;
}

class sessionInfo {
  username: string;
  account: string;
  agency: string;
  teclas: string[][];
}

type LoginKeycloak = {
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
};
