type Maybe<T> = T | null;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Long: any;
  Object: any;
  Upload: any;
};

type Actor = {
  __typename?: 'Actor';
  _id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  aliases: Array<Scalars['String']>;
  addedOn: Scalars['Long'];
  bornOn?: Maybe<Scalars['Long']>;
  favorite: Scalars['Boolean'];
  bookmark?: Maybe<Scalars['Long']>;
  rating?: Maybe<Scalars['Int']>;
  customFields: Scalars['Object'];
  age?: Maybe<Scalars['Int']>;
  availableFields: Array<CustomField>;
  watches: Array<Scalars['Long']>;
  labels: Array<Label>;
  numScenes: Scalars['Int'];
  avatar?: Maybe<Image>;
  thumbnail?: Maybe<Image>;
  altThumbnail?: Maybe<Image>;
  hero?: Maybe<Image>;
  collabs: Array<Actor>;
  nationality?: Maybe<Nationality>;
};

type ActorSearchQuery = {
  query?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Boolean']>;
  rating?: Maybe<Scalars['Int']>;
  include?: Maybe<Array<Scalars['String']>>;
  exclude?: Maybe<Array<Scalars['String']>>;
  nationality?: Maybe<Scalars['String']>;
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  studios?: Maybe<Array<Scalars['String']>>;
};

type ActorSearchResults = {
  __typename?: 'ActorSearchResults';
  numItems: Scalars['Int'];
  numPages: Scalars['Int'];
  items: Array<Actor>;
};

type ActorUpdateOpts = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Int']>;
  labels?: Maybe<Array<Scalars['String']>>;
  aliases?: Maybe<Array<Scalars['String']>>;
  avatar?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  altThumbnail?: Maybe<Scalars['String']>;
  hero?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Long']>;
  bornOn?: Maybe<Scalars['Long']>;
  customFields?: Maybe<Scalars['Object']>;
  nationality?: Maybe<Scalars['String']>;
};

type Crop = {
  left: Scalars['Int'];
  top: Scalars['Int'];
  width: Scalars['Int'];
  height: Scalars['Int'];
};

type CustomField = {
  __typename?: 'CustomField';
  _id: Scalars['String'];
  name: Scalars['String'];
  target: Array<CustomFieldTarget>;
  type: CustomFieldType;
  values?: Maybe<Array<Scalars['String']>>;
  unit?: Maybe<Scalars['String']>;
};

enum CustomFieldTarget {
  Scenes = 'SCENES',
  Actors = 'ACTORS',
  Movies = 'MOVIES',
  Images = 'IMAGES',
  Studios = 'STUDIOS',
  Albums = 'ALBUMS'
}

enum CustomFieldType {
  Number = 'NUMBER',
  String = 'STRING',
  Boolean = 'BOOLEAN',
  SingleSelect = 'SINGLE_SELECT',
  MultiSelect = 'MULTI_SELECT'
}

type Dimensions = {
  __typename?: 'Dimensions';
  width?: Maybe<Scalars['Long']>;
  height?: Maybe<Scalars['Long']>;
};

type Image = {
  __typename?: 'Image';
  _id: Scalars['String'];
  name: Scalars['String'];
  addedOn: Scalars['Long'];
  favorite: Scalars['Boolean'];
  bookmark?: Maybe<Scalars['Long']>;
  rating?: Maybe<Scalars['Int']>;
  customFields: Scalars['Object'];
  meta: ImageMeta;
  path?: Maybe<Scalars['String']>;
  scene?: Maybe<Scene>;
  actors: Array<Actor>;
  labels: Array<Label>;
  thumbnail?: Maybe<Image>;
  studio?: Maybe<Studio>;
  color?: Maybe<Scalars['String']>;
};

type ImageMeta = {
  __typename?: 'ImageMeta';
  size?: Maybe<Scalars['Long']>;
  dimensions: Dimensions;
};

type ImageSearchQuery = {
  query?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Boolean']>;
  rating?: Maybe<Scalars['Int']>;
  include?: Maybe<Array<Scalars['String']>>;
  exclude?: Maybe<Array<Scalars['String']>>;
  studios?: Maybe<Array<Scalars['String']>>;
  actors?: Maybe<Array<Scalars['String']>>;
  scenes?: Maybe<Array<Scalars['String']>>;
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

type ImageSearchResults = {
  __typename?: 'ImageSearchResults';
  numItems: Scalars['Int'];
  numPages: Scalars['Int'];
  items: Array<Image>;
};

type ImageUpdateOpts = {
  name?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Int']>;
  labels?: Maybe<Array<Scalars['String']>>;
  actors?: Maybe<Array<Scalars['String']>>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Long']>;
  studio?: Maybe<Scalars['String']>;
  scene?: Maybe<Scalars['String']>;
  customFields?: Maybe<Scalars['Object']>;
  color?: Maybe<Scalars['String']>;
};

type Info = {
  __typename?: 'Info';
  id?: Maybe<Scalars['String']>;
};

type Label = {
  __typename?: 'Label';
  _id: Scalars['String'];
  name: Scalars['String'];
  aliases: Array<Scalars['String']>;
  addedOn: Scalars['Long'];
  color?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Image>;
};

type LabelUpdateOpts = {
  name?: Maybe<Scalars['String']>;
  aliases?: Maybe<Array<Scalars['String']>>;
  thumbnail?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};


type Marker = {
  __typename?: 'Marker';
  _id: Scalars['String'];
  name: Scalars['String'];
  time: Scalars['Int'];
  rating?: Maybe<Scalars['Int']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Long']>;
  labels: Array<Label>;
  thumbnail?: Maybe<Image>;
  scene?: Maybe<Scene>;
};

type MarkerSearchQuery = {
  query?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Boolean']>;
  rating?: Maybe<Scalars['Int']>;
  include?: Maybe<Array<Scalars['String']>>;
  exclude?: Maybe<Array<Scalars['String']>>;
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

type MarkerSearchResults = {
  __typename?: 'MarkerSearchResults';
  numItems: Scalars['Int'];
  numPages: Scalars['Int'];
  items: Array<Marker>;
};

type MarkerUpdateOpts = {
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Long']>;
  actors?: Maybe<Array<Scalars['String']>>;
  name?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Int']>;
  labels?: Maybe<Array<Scalars['String']>>;
};

type Minput = {
  id?: Maybe<Scalars['String']>;
};

type Movie = {
  __typename?: 'Movie';
  _id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  addedOn: Scalars['Long'];
  releaseDate?: Maybe<Scalars['Long']>;
  favorite: Scalars['Boolean'];
  bookmark?: Maybe<Scalars['Long']>;
  customFields: Scalars['Object'];
  rating?: Maybe<Scalars['Int']>;
  frontCover?: Maybe<Image>;
  backCover?: Maybe<Image>;
  spineCover?: Maybe<Image>;
  scenes: Array<Scene>;
  actors: Array<Actor>;
  labels: Array<Label>;
  duration?: Maybe<Scalars['Long']>;
  size?: Maybe<Scalars['Long']>;
  studio?: Maybe<Studio>;
};

type MovieSearchQuery = {
  query?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Boolean']>;
  rating?: Maybe<Scalars['Int']>;
  include?: Maybe<Array<Scalars['String']>>;
  exclude?: Maybe<Array<Scalars['String']>>;
  studios?: Maybe<Array<Scalars['String']>>;
  actors?: Maybe<Array<Scalars['String']>>;
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  durationMin?: Maybe<Scalars['Int']>;
  durationMax?: Maybe<Scalars['Int']>;
};

type MovieSearchResults = {
  __typename?: 'MovieSearchResults';
  numItems: Scalars['Int'];
  numPages: Scalars['Int'];
  items: Array<Movie>;
};

type MovieUpdateOpts = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['Long']>;
  frontCover?: Maybe<Scalars['String']>;
  backCover?: Maybe<Scalars['String']>;
  spineCover?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Long']>;
  rating?: Maybe<Scalars['Int']>;
  scenes?: Maybe<Array<Scalars['String']>>;
  studio?: Maybe<Scalars['String']>;
  customFields?: Maybe<Scalars['Object']>;
};

type Mutation = {
  __typename?: 'Mutation';
  addActor: Actor;
  addLabel: Label;
  addMovie: Movie;
  addScene: Scene;
  addStudio: Studio;
  attachActorToUnmatchedScenes?: Maybe<Actor>;
  attachStudioToUnmatchedScenes?: Maybe<Studio>;
  createCustomField: CustomField;
  createMarker: Marker;
  m?: Maybe<Info>;
  removeActors: Scalars['Boolean'];
  removeCustomField: Scalars['Boolean'];
  removeImages: Scalars['Boolean'];
  removeLabel: Scalars['Boolean'];
  removeLabels: Scalars['Boolean'];
  removeMarkers: Scalars['Boolean'];
  removeMovies: Scalars['Boolean'];
  removeScenes: Scalars['Boolean'];
  removeStudios: Scalars['Boolean'];
  runActorPlugins?: Maybe<Actor>;
  runScenePlugins?: Maybe<Scene>;
  runStudioPlugins?: Maybe<Studio>;
  screenshotScene?: Maybe<Image>;
  unwatchScene: Scene;
  updateActors: Array<Actor>;
  updateCustomField: CustomField;
  updateImages: Array<Image>;
  updateLabels: Array<Label>;
  updateMarkers: Array<Marker>;
  updateMovies: Array<Movie>;
  updateScenes: Array<Scene>;
  updateStudios: Array<Studio>;
  uploadImage: Image;
  watchScene: Scene;
};


type MutationAddActorArgs = {
  name: Scalars['String'];
  aliases?: Maybe<Array<Scalars['String']>>;
  labels?: Maybe<Array<Scalars['String']>>;
};


type MutationAddLabelArgs = {
  name: Scalars['String'];
  aliases?: Maybe<Array<Scalars['String']>>;
};


type MutationAddMovieArgs = {
  name: Scalars['String'];
  scenes?: Maybe<Array<Scalars['String']>>;
};


type MutationAddSceneArgs = {
  name: Scalars['String'];
  actors?: Maybe<Array<Scalars['String']>>;
  labels?: Maybe<Array<Scalars['String']>>;
};


type MutationAddStudioArgs = {
  name: Scalars['String'];
  labels?: Maybe<Array<Scalars['String']>>;
};


type MutationAttachActorToUnmatchedScenesArgs = {
  id: Scalars['String'];
};


type MutationAttachStudioToUnmatchedScenesArgs = {
  id: Scalars['String'];
};


type MutationCreateCustomFieldArgs = {
  name: Scalars['String'];
  target: Array<CustomFieldTarget>;
  type: CustomFieldType;
  values?: Maybe<Array<Scalars['String']>>;
  unit?: Maybe<Scalars['String']>;
};


type MutationCreateMarkerArgs = {
  scene: Scalars['String'];
  name: Scalars['String'];
  time: Scalars['Int'];
  rating?: Maybe<Scalars['Int']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Long']>;
  labels?: Maybe<Array<Scalars['String']>>;
};


type MutationMArgs = {
  input?: Maybe<Minput>;
};


type MutationRemoveActorsArgs = {
  ids: Array<Scalars['String']>;
};


type MutationRemoveCustomFieldArgs = {
  id: Scalars['String'];
};


type MutationRemoveImagesArgs = {
  ids: Array<Scalars['String']>;
};


type MutationRemoveLabelArgs = {
  item: Scalars['String'];
  label: Scalars['String'];
};


type MutationRemoveLabelsArgs = {
  ids: Array<Scalars['String']>;
};


type MutationRemoveMarkersArgs = {
  ids: Array<Scalars['String']>;
};


type MutationRemoveMoviesArgs = {
  ids: Array<Scalars['String']>;
};


type MutationRemoveScenesArgs = {
  ids: Array<Scalars['String']>;
  deleteImages?: Maybe<Scalars['Boolean']>;
};


type MutationRemoveStudiosArgs = {
  ids: Array<Scalars['String']>;
};


type MutationRunActorPluginsArgs = {
  id: Scalars['String'];
};


type MutationRunScenePluginsArgs = {
  id: Scalars['String'];
};


type MutationRunStudioPluginsArgs = {
  id: Scalars['String'];
};


type MutationScreenshotSceneArgs = {
  id: Scalars['String'];
  sec: Scalars['Float'];
};


type MutationUnwatchSceneArgs = {
  id: Scalars['String'];
};


type MutationUpdateActorsArgs = {
  ids: Array<Scalars['String']>;
  opts: ActorUpdateOpts;
};


type MutationUpdateCustomFieldArgs = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Scalars['String']>>;
  unit?: Maybe<Scalars['String']>;
};


type MutationUpdateImagesArgs = {
  ids: Array<Scalars['String']>;
  opts: ImageUpdateOpts;
};


type MutationUpdateLabelsArgs = {
  ids: Array<Scalars['String']>;
  opts: LabelUpdateOpts;
};


type MutationUpdateMarkersArgs = {
  ids: Array<Scalars['String']>;
  opts: MarkerUpdateOpts;
};


type MutationUpdateMoviesArgs = {
  ids: Array<Scalars['String']>;
  opts: MovieUpdateOpts;
};


type MutationUpdateScenesArgs = {
  ids: Array<Scalars['String']>;
  opts: SceneUpdateOpts;
};


type MutationUpdateStudiosArgs = {
  ids: Array<Scalars['String']>;
  opts: StudioUpdateOpts;
};


type MutationUploadImageArgs = {
  file: Scalars['Upload'];
  name?: Maybe<Scalars['String']>;
  actors?: Maybe<Array<Scalars['String']>>;
  labels?: Maybe<Array<Scalars['String']>>;
  scene?: Maybe<Scalars['String']>;
  crop?: Maybe<Crop>;
  studio?: Maybe<Scalars['String']>;
  lossless?: Maybe<Scalars['Boolean']>;
  compress?: Maybe<Scalars['Boolean']>;
};


type MutationWatchSceneArgs = {
  id: Scalars['String'];
};

type Nationality = {
  __typename?: 'Nationality';
  name: Scalars['String'];
  alpha2: Scalars['String'];
  nationality: Scalars['String'];
};


type Query = {
  __typename?: 'Query';
  getActorById?: Maybe<Actor>;
  getActors: ActorSearchResults;
  getActorsWithoutLabels: Array<Actor>;
  getActorsWithoutScenes: Array<Actor>;
  getCustomFields: Array<CustomField>;
  getImageById?: Maybe<Image>;
  getImages: ImageSearchResults;
  getLabelById?: Maybe<Label>;
  getLabels: Array<Label>;
  getMarkers: MarkerSearchResults;
  getMovieById?: Maybe<Movie>;
  getMovies: MovieSearchResults;
  getQueueInfo: QueueInfo;
  getSceneById?: Maybe<Scene>;
  getScenes: SceneSearchResults;
  getScenesWithoutActors: Array<Scene>;
  getScenesWithoutLabels: Array<Scene>;
  getScenesWithoutStudios: Array<Scene>;
  getStudioById?: Maybe<Studio>;
  getStudios: StudioSearchResults;
  getUnwatchedActors: Array<Actor>;
  getWatches: Array<SceneView>;
  numActors: Scalars['Int'];
  numImages: Scalars['Int'];
  numLabels: Scalars['Int'];
  numMovies: Scalars['Int'];
  numScenes: Scalars['Int'];
  numStudios: Scalars['Int'];
  q?: Maybe<Info>;
  topActors: Array<Actor>;
};


type QueryGetActorByIdArgs = {
  id: Scalars['String'];
};


type QueryGetActorsArgs = {
  query: ActorSearchQuery;
  seed?: Maybe<Scalars['String']>;
};


type QueryGetActorsWithoutLabelsArgs = {
  num?: Maybe<Scalars['Int']>;
};


type QueryGetActorsWithoutScenesArgs = {
  num?: Maybe<Scalars['Int']>;
};


type QueryGetImageByIdArgs = {
  id: Scalars['String'];
};


type QueryGetImagesArgs = {
  query: ImageSearchQuery;
  seed?: Maybe<Scalars['String']>;
};


type QueryGetLabelByIdArgs = {
  id: Scalars['String'];
};


type QueryGetMarkersArgs = {
  query: MarkerSearchQuery;
  seed?: Maybe<Scalars['String']>;
};


type QueryGetMovieByIdArgs = {
  id: Scalars['String'];
};


type QueryGetMoviesArgs = {
  query: MovieSearchQuery;
  seed?: Maybe<Scalars['String']>;
};


type QueryGetSceneByIdArgs = {
  id: Scalars['String'];
};


type QueryGetScenesArgs = {
  query: SceneSearchQuery;
  seed?: Maybe<Scalars['String']>;
};


type QueryGetScenesWithoutActorsArgs = {
  num?: Maybe<Scalars['Int']>;
};


type QueryGetScenesWithoutLabelsArgs = {
  num?: Maybe<Scalars['Int']>;
};


type QueryGetScenesWithoutStudiosArgs = {
  num?: Maybe<Scalars['Int']>;
};


type QueryGetStudioByIdArgs = {
  id: Scalars['String'];
};


type QueryGetStudiosArgs = {
  query: StudioSearchQuery;
  seed?: Maybe<Scalars['String']>;
};


type QueryGetUnwatchedActorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


type QueryGetWatchesArgs = {
  min?: Maybe<Scalars['Long']>;
  max?: Maybe<Scalars['Long']>;
};


type QueryQArgs = {
  id?: Maybe<Scalars['String']>;
};


type QueryTopActorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

type QueueInfo = {
  __typename?: 'QueueInfo';
  length: Scalars['Int'];
  processing: Scalars['Boolean'];
};

type Scene = {
  __typename?: 'Scene';
  _id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  addedOn: Scalars['Long'];
  releaseDate?: Maybe<Scalars['Long']>;
  favorite: Scalars['Boolean'];
  bookmark?: Maybe<Scalars['Long']>;
  rating?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  streamLinks: Array<Scalars['String']>;
  watches: Array<Scalars['Long']>;
  meta: SceneMeta;
  customFields: Scalars['Object'];
  processed?: Maybe<Scalars['Boolean']>;
  availableFields: Array<CustomField>;
  thumbnail?: Maybe<Image>;
  preview?: Maybe<Image>;
  images: Array<Image>;
  actors: Array<Actor>;
  labels: Array<Label>;
  studio?: Maybe<Studio>;
  markers: Array<Marker>;
  movies: Array<Movie>;
};

type SceneMeta = {
  __typename?: 'SceneMeta';
  size?: Maybe<Scalars['Long']>;
  duration?: Maybe<Scalars['Int']>;
  dimensions: Dimensions;
  fps?: Maybe<Scalars['Float']>;
};

type SceneSearchQuery = {
  query?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Boolean']>;
  rating?: Maybe<Scalars['Int']>;
  include?: Maybe<Array<Scalars['String']>>;
  exclude?: Maybe<Array<Scalars['String']>>;
  studios?: Maybe<Array<Scalars['String']>>;
  actors?: Maybe<Array<Scalars['String']>>;
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  durationMin?: Maybe<Scalars['Int']>;
  durationMax?: Maybe<Scalars['Int']>;
};

type SceneSearchResults = {
  __typename?: 'SceneSearchResults';
  numItems: Scalars['Int'];
  numPages: Scalars['Int'];
  items: Array<Scene>;
};

type SceneUpdateOpts = {
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Long']>;
  actors?: Maybe<Array<Scalars['String']>>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Int']>;
  labels?: Maybe<Array<Scalars['String']>>;
  streamLinks?: Maybe<Array<Scalars['String']>>;
  thumbnail?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['Long']>;
  studio?: Maybe<Scalars['String']>;
  customFields?: Maybe<Scalars['Object']>;
};

type SceneView = {
  __typename?: 'SceneView';
  _id: Scalars['String'];
  scene?: Maybe<Scene>;
  date: Scalars['Long'];
};

type Studio = {
  __typename?: 'Studio';
  _id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  addedOn: Scalars['Long'];
  favorite: Scalars['Boolean'];
  bookmark?: Maybe<Scalars['Long']>;
  customFields: Scalars['Object'];
  aliases?: Maybe<Array<Scalars['String']>>;
  parent?: Maybe<Studio>;
  substudios: Array<Studio>;
  numScenes: Scalars['Int'];
  thumbnail?: Maybe<Image>;
  rating?: Maybe<Scalars['Int']>;
  scenes: Array<Scene>;
  labels: Array<Label>;
  actors: Array<Actor>;
  movies: Array<Movie>;
  availableFields: Array<CustomField>;
};

type StudioSearchQuery = {
  query?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Boolean']>;
  include?: Maybe<Array<Scalars['String']>>;
  exclude?: Maybe<Array<Scalars['String']>>;
  sortBy?: Maybe<Scalars['String']>;
  sortDir?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

type StudioSearchResults = {
  __typename?: 'StudioSearchResults';
  numItems: Scalars['Int'];
  numPages: Scalars['Int'];
  items: Array<Studio>;
};

type StudioUpdateOpts = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  bookmark?: Maybe<Scalars['Long']>;
  parent?: Maybe<Scalars['String']>;
  labels?: Maybe<Array<Scalars['String']>>;
  aliases?: Maybe<Array<Scalars['String']>>;
};

