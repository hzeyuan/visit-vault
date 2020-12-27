import {
  actorCollection,
  movieCollection,
  movieSceneCollection,
  sceneCollection,
} from "../database";
import { mapAsync } from "../utils/async";
import { generateHash } from "../utils/hash";
import * as logger from "../utils/logger";
import { arrayDiff } from "../utils/misc";
import Actor from "./actor";
import Label from "./label";
import MovieScene from "./movie_scene";
import Scene from "./scene";

export default class Movie {
  _id: string;
  name: string;
  description: string | null = null;
  addedOn = +new Date();
  releaseDate: number | null = null;
  frontCover: string | null = null;
  backCover: string | null = null;
  spineCover: string | null = null;
  favorite = false;
  bookmark: number | null = null;
  rating = 0;
  scenes?: string[]; // backwards compatibility
  customFields: Record<string, boolean | string | number | string[] | null> = {};
  studio: string | null = null;

  static async calculateDuration(movie: Movie): Promise<number | null> {
    const scenesWithSource = (await Movie.getScenes(movie)).filter(
      (scene) => scene.meta && scene.path
    );

    if (!scenesWithSource.length) return null;

    return scenesWithSource.reduce((dur, scene) => dur + <number>scene.meta.duration, 0);
  }

  static async filterStudio(studioId: string): Promise<void> {
    for (const movie of await Movie.getAll()) {
      if (movie.studio === studioId) {
        movie.studio = null;
        await movieCollection.upsert(movie._id, movie);
      }
    }
  }

  static remove(_id: string): Promise<Movie> {
    return movieCollection.remove(_id);
  }

  static getById(_id: string): Promise<Movie | null> {
    return movieCollection.get(_id);
  }

  static getBulk(_ids: string[]): Promise<Movie[]> {
    return movieCollection.getBulk(_ids);
  }

  static getAll(): Promise<Movie[]> {
    return movieCollection.getAll();
  }

  static async getByScene(id: string): Promise<Movie[]> {
    const movieScenes = await MovieScene.getByScene(id);
    return (await Movie.getBulk(movieScenes.map((ms) => ms.movie))).filter(Boolean);
  }

  static getByStudio(studioId: string): Promise<Movie[]> {
    return movieCollection.query("studio-index", studioId);
  }

  static async getLabels(movie: Movie): Promise<Label[]> {
    const scenes = await Movie.getScenes(movie);
    const labelIds = [
      ...new Set((await mapAsync(scenes, Scene.getLabels)).flat().map((a) => a._id)),
    ];
    return await Label.getBulk(labelIds);
  }

  static async getActors(movie: Movie): Promise<Actor[]> {
    const scenes = await Movie.getScenes(movie);
    const actorIds = [
      ...new Set((await mapAsync(scenes, Scene.getActors)).flat().map((a) => a._id)),
    ];
    return (await actorCollection.getBulk(actorIds))
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  static async setScenes(movie: Movie, sceneIds: string[]): Promise<void> {
    const oldRefs = await MovieScene.getByMovie(movie._id);

    const { removed, added } = arrayDiff(oldRefs, [...new Set(sceneIds)], "scene", (l) => l);

    for (const oldRef of removed) {
      await movieSceneCollection.remove(oldRef._id);
    }

    let index = 0;
    for (const id of added) {
      const movieScene = new MovieScene(movie._id, id);
      logger.log(`${index} Adding scene to movie: ${JSON.stringify(movieScene)}`);
      movieScene.index = index++;
      await movieSceneCollection.upsert(movieScene._id, movieScene);
    }
  }

  static async getScenes(movie: Movie): Promise<Scene[]> {
    const references = await MovieScene.getByMovie(movie._id);
    return (await sceneCollection.getBulk(references.map((r) => r.scene))).filter(Boolean);
  }

  static async getRating(movie: Movie): Promise<number> {
    const scenesWithScore = (await Movie.getScenes(movie)).filter((scene) => !!scene.rating);

    if (!scenesWithScore.length) return 0;

    return Math.round(
      scenesWithScore.reduce((rating, scene) => rating + scene.rating, 0) / scenesWithScore.length
    );
  }

  constructor(name: string) {
    this._id = `mo_${generateHash()}`;
    this.name = name.trim();
  }
}
