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
// import { ChannelStats, EarningsChart, EntryCallout, Highlights, TeamMeeting, Teams } from "@/pages/dashboards";
import { TicketTable } from "../components/TicketTable";

const UsersDash = () => {
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
            description="Gestion, Recherche et administration des tickets"
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

            <div className="col-12">

              <div className="lg:col-span-2">
                <TicketTable />
              </div>
            </div>
          </div>
        </div>

      </Container>
    </Fragment>
  );
};

export { UsersDash };
