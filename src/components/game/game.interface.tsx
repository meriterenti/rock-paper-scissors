export type Results = {
    id: string,
    message: string;
    src: string;
}

export type OutcomeProps = {
    wins: number;
    loses: number;
    draws: number;
}

export type ScoreProps = OutcomeProps & {
    total: number
}

export type BeaterIds = string[];
export type CrusherIds = string[];

export type WeaponProps = {
    id: string;
    beater_ids: BeaterIds;
    crusher_ids: CrusherIds;
    src: string;
  };

export type PlayerProps = {
    userName: string;
    weapons: WeaponProps[];
    scores: ScoreProps;
}