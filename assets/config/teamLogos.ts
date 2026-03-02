// Import the logo images
const UNCLogo = require('../temp/unc_logo.png');
const DukeLogo = require('../temp/duke_logo.png');
const UVALogo = require('../temp/uva_logo.png');
const VTLogo = require('../temp/vt_logo.png');
const WakeLogo = require('../temp/wake_forest_logo.png');
const BostonCollegeLogo = require('../temp/bc_logo.png');
const ClemsonLogo = require('../temp/clemson_logo.png');
const GeorgiaTechLogo = require('../temp/georgia_tech_logo.png');
const FloridaStateLogo = require('../temp/florida_state_logo.png');
const LouisvilleLogo = require('../temp/louisville_logo.png');
const MiamiLogo = require('../temp/miami_logo.png');
const NCStateLogo = require('../temp/NC_state_logo.png');
const NotreDameLogo = require('../temp/notre_dame_logo.png');
const SyracuseLogo = require('../temp/syracuse_logo.png');
const PittLogo = require('../temp/pitt_logo.png');
const AtlantaHawksLogo = require('../temp/atlanta_hawks_logo.png');
const BostonCelticsLogo = require('../temp/boston_celtics_logo.png');
const CharlotteHornetsLogo = require('../temp/charlotte_hornets_logo.png');
const BrooklynNetsLogo = require('../temp/brooklyn_nets_logo.png');
const ClevelandCavaliersLogo = require('../temp/cleveland_cavaliers_logo.png');
const ChicagoBullsLogo = require('../temp/chicago_bulls_logo.png');
const DallasMavericksLogo = require('../temp/dallas_mavericks_logo.png');
const DenverNuggetsLogo = require('../temp/denver_nuggets_logo.png');
const GoldenStateWarriorsLogo = require('../temp/golden_state_warriors_logo.png');
const DetroitPistonsLogo = require('../temp/detroit_pistons_logo.png');
const HoustonRocketsLogo = require('../temp/houston_rockets_logo.png');
const IndianaPacersLogo = require('../temp/indiana_pacers_logo.png');
const LosAngelesClippersLogo = require('../temp/la_clippers_logo.png');
const LosAngelesLakersLogo = require('../temp/la_lakers_logo.png');
const MiamiHeatLogo = require('../temp/miami_heat_logo.png');
const MemphisGrizzliesLogo = require('../temp/memphis_grizzlies_logo.png');
const MinnesotaTimberwolvesLogo = require('../temp/minnesota_timberwolves_logo.png');
const MilwaukeeBucksLogo = require('../temp/milwaukee_bucks_logo.png');
const NewOrleansPelicansLogo = require('../temp/new_orleans_pelicans_logo.png');
const NewYorkKnicksLogo = require('../temp/new_york_knicks_logo.png');
const OrlandoMagicLogo = require('../temp/orlando_magic_logo.png');
const OklahomaCityThunderLogo = require('../temp/oklahoma_city_thunder_logo.png');
const Philadelphia76ersLogo = require('../temp/philadelphia_76ers_logo.png');
const PhoenixSunsLogo = require('../temp/phoenix_suns_logo.png');
const SacramentoKingsLogo = require('../temp/sacramento_kings_logo.png');
const PortlandTrailblazersLogo = require('../temp/portland_trailblazers_logo.png');
const SanAntonioSpursLogo = require('../temp/san_antonio_spurs_logo.png');
const TorontoRaptorsLogo = require('../temp/toronto_raptors_logo.png');
const UtahJazzLogo = require('../temp/utah_jazz_logo.png');
const WashingtonWizardsLogo = require('../temp/washington_wizards_logo.png');


const teamLogos = {
  UNC: UNCLogo,
  Duke: DukeLogo,
  UVA: UVALogo,
  VT: VTLogo,
  WakeForest: WakeLogo,
  BostonCollege: BostonCollegeLogo,
  Clemson: ClemsonLogo,
  GeorgiaTech: GeorgiaTechLogo,
  FloridaState: FloridaStateLogo,
  Louisville: LouisvilleLogo,
  Miami: MiamiLogo,
  NCState: NCStateLogo,
  NotreDame: NotreDameLogo,
  Pitt: PittLogo,
  Syracuse: SyracuseLogo,
  BostonCeltics: BostonCelticsLogo,
  AtlantaHawks: AtlantaHawksLogo,
  BrooklynNets: BrooklynNetsLogo,
  CharlotteHornets: CharlotteHornetsLogo,
  ChicagoBulls: ChicagoBullsLogo,
  ClevelandCavaliers: ClevelandCavaliersLogo,
  DallasMavericks: DallasMavericksLogo,
  DenverNuggets: DenverNuggetsLogo,
  DetroitPistons: DetroitPistonsLogo,
  GoldenStateWarriors: GoldenStateWarriorsLogo,
  HoustonRockets: HoustonRocketsLogo,
  IndianaPacers: IndianaPacersLogo,
  LosAngelesClippers: LosAngelesClippersLogo,
  LosAngelesLakers: LosAngelesLakersLogo,
  MiamiHeat: MiamiHeatLogo,
  MemphisGrizzlies: MemphisGrizzliesLogo,
  MilwaukeeBucks: MilwaukeeBucksLogo,
  MinnesotaTimberwolves: MinnesotaTimberwolvesLogo,
  NewOrleansPelicans: NewOrleansPelicansLogo,
  NewYorkKnicks: NewYorkKnicksLogo,
  OklahomaCityThunder: OklahomaCityThunderLogo,
  OrlandoMagic: OrlandoMagicLogo,
  PhoenixSuns: PhoenixSunsLogo,
  Philadelphia76ers: Philadelphia76ersLogo,
  PortlandTrailblazers: PortlandTrailblazersLogo,
  SacramentoKings: SacramentoKingsLogo,
  SanAntonioSpurs: SanAntonioSpursLogo,
  TorontoRaptors: TorontoRaptorsLogo,
  UtahJazz: UtahJazzLogo,
  WashingtonWizards: WashingtonWizardsLogo,
};

export type TeamName = keyof typeof teamLogos;

// Function to normalize team names by removing spaces
export const normalizeTeamName = (teamName: string): TeamName => {
  const normalized = teamName.replace(/\s+/g, '');
  return normalized as TeamName;
};

export default teamLogos;
