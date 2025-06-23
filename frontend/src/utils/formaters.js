export const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

import { format } from "date-fns";
export const formattedDate = (message) =>
  format(new Date(message.createdAt), "hh:mm a");
