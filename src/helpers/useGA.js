import { useEffect } from 'react';
import ga from "react-ga4";

export function useGA(id, route) {
  useEffect(() => {
    ga.initialize(id);
    ga.send({ hitType: "pageview", page: route });
  }, [id, route]);
}

export function event(category, action, label) {
  ga.event({
    category: category,
    action: action,
    label: label,
  });
}

