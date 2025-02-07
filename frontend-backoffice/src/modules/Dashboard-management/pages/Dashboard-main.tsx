/* eslint-disable prettier/prettier */
import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from "@/layouts/demo1/toolbar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { KeenIcon } from "@/components/keenicons";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import {
//   ChannelStats,
//   EarningsChart,
//   EntryCallout,
//   Highlights,
//   TeamMeeting,
//   Teams,
// } from "@/pages/dashboards";
import { DashHighLight } from "../components/DashHighLight";
import { DashEarningsChart } from "../components/DashEarningsChart";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DashboardMain = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  const customIcon = L.divIcon({
    html: `<i class="ki-solid ki-geolocation text-3xl text-success"></i>`,
    className: "leaflet-marker",
    bgPos: [10, 10],
    iconAnchor: [20, 37],
    popupAnchor: [0, -37],
  });

  const position: [number, number] = [51.505, -0.09];

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title="Tableau de bord"
            description="Centre de gestion des infrastructure de Uban Ticketing"
          />
          <ToolbarActions>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={cn(
                    "btn btn-sm btn-light data-[state=open]:bg-light-active",
                    !date && "text-gray-400",
                  )}
                >
                  <KeenIcon icon="calendar" className="me-0.5" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </ToolbarActions>
        </Toolbar>

        <div className="row">
          <div className="grid gap-5 lg:gap-7.5">
            <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
              <div className="lg:col-span-1">
                <DashHighLight limit={3} />
              </div>

              <div className="lg:col-span-2">
                <DashEarningsChart />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 row">
          <div className="col-12 col-md-12">
            {/* <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer> */}
            <MapContainer
              center={[40.725, -73.985]}
              zoom={30}
              style={{width: "100%", height: "450px"}}
              className="rounded-xl w-full md:w-80 min-h-52"
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[40.724716, -73.984789]} icon={customIcon}>
                <Popup>430 E 6th St, New York, 10009.</Popup>
              </Marker>
            </MapContainer>
            {/* <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.216063747181!2d2.4277021535512504!3d6.366078053562473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10235594bf28d051%3A0x6fb8aeff9e296a51!2sEpitech%20Benin!5e0!3m2!1sfr!2sbj!4v1737906455358!5m2!1sfr!2sbj"
      width="100%"
      height="450"
      style={{ border: 0 }}
      // allowfullscreen={""}
      loading="lazy"
      // referrerpolicy="no-referrer-when-downgrade"
    ></iframe> */}
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export { DashboardMain };
