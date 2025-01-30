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
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ChannelStats, EarningsChart, EntryCallout, Highlights, TeamMeeting, Teams } from "@/pages/dashboards";

const TicketsList = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  const position: [number, number] = [51.505, -0.09];

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title="Tickets"
            description="Central Hub for Personal Customization"
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

        <div className="p-5 row">
          <div className="col-12 col-md-4">
            <div className="bg-gray">
              <h1>Lorem, ipsum.</h1>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div className="row">
          <div className="grid gap-5 lg:gap-7.5">

            <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">

              <div className="lg:col-span-2">
                <Teams />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export { TicketsList };
