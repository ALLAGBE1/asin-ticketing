import { KeenIcon } from "@/components";

// import { CommonAvatars, CommonRating } from '../common';

interface ITeamProps {
  icon: string;
  title: string;
  description: string;
  labels: string[];
  team: {
    size?: string;
    group: Array<{ filename?: string; variant?: string; fallback?: string }>;
    more?: {
      number: number;
      variant: string;
    };
    className?: string;
  };
  connected: boolean;
  rating: {
    value: number;
    round: number;
  };
}

const ItineraireItem = ({
  icon,
  title,
  description,
  labels,
  rating,
  team,
  connected,
}: ITeamProps) => {
  const renderItem = (label: string, index: number) => {
    return (
      <span key={index} className="badge badge-sm badge-outline">
        {label}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="card-body grid gap-7 py-7.5">
        <div className="grid place-items-center gap-4">
          <div className="flex justify-center items-center size-14 rounded-full ring-1 ring-gray-300 bg-gray-100">
            <KeenIcon icon="route" className="text-2xl text-gray-600" />
          </div>

          <div className="grid place-items-center">
            <a
              href="#"
              className="text-base font-medium text-gray-900 hover:text-primary-active mb-px"
            >
              {/* {title} */} Ab-C -- Ctn (01)
            </a>
            <span className="text-2sm text-gray-700 text-center">
              {/* {description} */} Itinéraire Abomey-Calavi vers Cotonou
            </span>
          </div>
        </div>

        <div className="grid">
          {/* <div className="flex items-center justify-between flex-wrap mb-3.5 gap-2">
            <span className="text-2xs text-gray-600 uppercase">skills</span>
            <div className="flex flex-wrap gap-1.5">
              {labels.map((label, index) => {
                return renderItem(label, index);
              })}
            </div>
          </div> */}

          <div className="flex items-center justify-between flex-wrap mb-3.5 gap-2 mt-1">
            <span className="text-2xs text-gray-600 uppercase">
              Carrefour Tokan -- UAC
            </span>
            <div className="flex flex-wrap gap-1.5 text-2xs text-red-400 uppercase" style={{fontWeight: "800"}}>
              500 CFA
            </div>
          </div>

          <div className="border-t border-gray-300 border-dashed"></div>

          <div className="flex items-center justify-between flex-wrap mb-3.5 gap-2 mt-4">
            <span className="text-2xs text-gray-600 uppercase">UAC -- Terrain</span>
            <div className="flex flex-wrap gap-1.5 text-2xs text-red-400 uppercase" style={{fontWeight: "800"}}>
               500 CFA
            </div>
          </div>

          <div className="border-t border-gray-300 border-dashed"></div>

          <div className="flex items-center justify-between flex-wrap mb-3.5 gap-2 mt-4">
            <span className="text-2xs text-gray-600 uppercase">Terrain -- Agontinkon</span>
            <div className="flex flex-wrap gap-1.5 text-2xs text-red-400 uppercase" style={{fontWeight: "800"}}>
               500 CFA
            </div>
          </div>

          <div className="border-t border-gray-300 border-dashed"></div>

          <div className="flex items-center justify-between flex-wrap mb-3.5 gap-2 mt-4">
            <span className="text-2xs text-gray-600 uppercase">Agontinkon -- St Michel</span>
            <div className="flex flex-wrap gap-1.5 text-2xs text-red-400 uppercase" style={{fontWeight: "800"}}>
               500 CFA
            </div>
          </div>

          {/* <div className="flex items-center justify-between flex-wrap my-2.5 gap-2">
            <span className="text-2xs text-gray-600 uppercase">rating</span>
            <CommonRating rating={rating.value} round={rating.round} />
          </div>

          <div className="border-t border-gray-300 border-dashed mb-3.5"></div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-2xs text-gray-600 uppercase">memebers</span>
            <CommonAvatars
              group={team.group}
              more={team.more}
              className={team.className}
              size={team.size}
            />
          </div> */}
        </div>
      </div>

      <div className="card-footer justify-center">
      <a className="btn btn-sm btn-primary">
            <KeenIcon icon="information" className="" /> Voir détails
          </a>
        {/* {connected ? (
          <a className="btn btn-light btn-sm">
            <KeenIcon icon="check-circle" className="" /> Joined
          </a>
        ) : (
          <a className="btn btn-sm btn-primary">
            <KeenIcon icon="people" className="" /> Join
          </a>
        )} */}
      </div>
    </div>
  );
};

export { ItineraireItem, type ITeamProps };
