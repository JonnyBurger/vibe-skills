import { useEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import mapboxgl, { Map } from "mapbox-gl";

// City coordinates
const LA_COORDS: [number, number] = [-118.2437, 34.0522];
const NY_COORDS: [number, number] = [-74.006, 40.7128];
const PARIS_COORDS: [number, number] = [2.2945, 48.8584]; // Eiffel Tower

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

export const LAtoNYMap = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { delayRender, continueRender } = useDelayRender();

  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  // Animation phases (in seconds)
  const zoomOutDuration = 2; // Zoom out from LA
  const laToNyDuration = 2; // Draw line from LA to NY
  const nyToParisDuration = 3; // Draw line from NY to Paris
  const parisZoomDuration = 3; // Zoom into Paris/Eiffel Tower

  // Convert to frames
  const zoomOutEndFrame = zoomOutDuration * fps;
  const laToNyEndFrame = (zoomOutDuration + laToNyDuration) * fps;
  const nyToParisEndFrame =
    (zoomOutDuration + laToNyDuration + nyToParisDuration) * fps;
  const parisZoomEndFrame =
    (zoomOutDuration + laToNyDuration + nyToParisDuration + parisZoomDuration) *
    fps;

  // Initial setup - focused on LA
  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 10,
      center: LA_COORDS,
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/standard",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("style.load", () => {
      // Hide all features from the Mapbox Standard style
      const hideFeatures = [
        "showRoadsAndTransit",
        "showRoads",
        "showTransit",
        "showPedestrianRoads",
        "showRoadLabels",
        "showTransitLabels",
        "showPlaceLabels",
        "showPointOfInterestLabels",
        "showPointsOfInterest",
        "showAdminBoundaries",
        "showLandmarkIcons",
        "showLandmarkIconLabels",
        "show3dObjects",
        "show3dBuildings",
        "show3dTrees",
        "show3dLandmarks",
        "show3dFacades",
      ];
      for (const feature of hideFeatures) {
        _map.setConfigProperty("basemap", feature, false);
      }

      _map.setConfigProperty("basemap", "colorMotorways", "transparent");
      _map.setConfigProperty("basemap", "colorRoads", "transparent");
      _map.setConfigProperty("basemap", "colorTrunks", "transparent");

      // Add city markers source
      _map.addSource("cities", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { name: "Los Angeles" },
              geometry: { type: "Point", coordinates: LA_COORDS },
            },
            {
              type: "Feature",
              properties: { name: "New York" },
              geometry: { type: "Point", coordinates: NY_COORDS },
            },
            {
              type: "Feature",
              properties: { name: "Paris" },
              geometry: { type: "Point", coordinates: PARIS_COORDS },
            },
          ],
        },
      });

      // Add route line source (starts empty)
      _map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [LA_COORDS],
          },
        },
      });

      // Add route line layer
      _map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#FF4444",
          "line-width": 6,
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
      });

      // Add city markers
      _map.addLayer({
        id: "city-markers",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": 12,
          "circle-color": "#FF4444",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#FFFFFF",
        },
      });

      // Add city labels
      _map.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 24,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#FFFFFF",
          "text-halo-color": "#000000",
          "text-halo-width": 2,
        },
      });
    });

    _map.on("load", () => {
      continueRender(handle);
      setMap(_map);
    });
  }, [handle, continueRender]);

  // Animate camera and line based on frame
  useEffect(() => {
    if (!map) return;

    const animationHandle = delayRender("Animating map...");

    // Phase 1: Zoom out from LA (0 to zoomOutEndFrame)
    // Phase 2: Draw line LA to NY (zoomOutEndFrame to laToNyEndFrame)
    // Phase 3: Draw line NY to Paris (laToNyEndFrame to nyToParisEndFrame)
    // Phase 4: Zoom into Paris with 3D (nyToParisEndFrame to parisZoomEndFrame)

    // Calculate LA to NY line progress
    const laToNyProgress = interpolate(
      frame,
      [zoomOutEndFrame, laToNyEndFrame],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      }
    );

    // Calculate NY to Paris line progress
    const nyToParisProgress = interpolate(
      frame,
      [laToNyEndFrame, nyToParisEndFrame],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      }
    );

    // Calculate Paris zoom progress
    const parisZoomProgress = interpolate(
      frame,
      [nyToParisEndFrame, parisZoomEndFrame],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      }
    );

    // Build line coordinates based on progress
    const linePoints: [number, number][] = [LA_COORDS];

    // LA to NY segment
    if (laToNyProgress > 0) {
      const laToNyLng =
        LA_COORDS[0] + (NY_COORDS[0] - LA_COORDS[0]) * laToNyProgress;
      const laToNyLat =
        LA_COORDS[1] + (NY_COORDS[1] - LA_COORDS[1]) * laToNyProgress;
      linePoints.push([laToNyLng, laToNyLat]);
    }

    // NY to Paris segment (only if LA to NY is complete)
    let currentTipLng = LA_COORDS[0];
    let currentTipLat = LA_COORDS[1];

    if (laToNyProgress >= 1 && nyToParisProgress > 0) {
      // Replace the last point with NY coords
      linePoints[linePoints.length - 1] = NY_COORDS;
      const nyToParisLng =
        NY_COORDS[0] + (PARIS_COORDS[0] - NY_COORDS[0]) * nyToParisProgress;
      const nyToParisLat =
        NY_COORDS[1] + (PARIS_COORDS[1] - NY_COORDS[1]) * nyToParisProgress;
      linePoints.push([nyToParisLng, nyToParisLat]);
      currentTipLng = nyToParisLng;
      currentTipLat = nyToParisLat;
    } else if (laToNyProgress > 0) {
      currentTipLng =
        LA_COORDS[0] + (NY_COORDS[0] - LA_COORDS[0]) * laToNyProgress;
      currentTipLat =
        LA_COORDS[1] + (NY_COORDS[1] - LA_COORDS[1]) * laToNyProgress;
    }

    // Update line data
    const lineData: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: linePoints,
      },
    };

    const source = map.getSource("route") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(lineData);
    }

    // Calculate zoom based on phase
    let zoom: number;
    let pitch: number;
    let bearing: number;
    let centerLng: number;
    let centerLat: number;

    if (frame <= zoomOutEndFrame) {
      // Phase 1: Zoom out from LA
      const zoomProgress = interpolate(frame, [0, zoomOutEndFrame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      zoom = interpolate(zoomProgress, [0, 1], [10, 4]);
      pitch = 0;
      bearing = 0;
      centerLng = LA_COORDS[0];
      centerLat = LA_COORDS[1];
    } else if (frame <= laToNyEndFrame) {
      // Phase 2: LA to NY - follow line tip
      zoom = 4;
      pitch = 0;
      bearing = 0;
      centerLng = currentTipLng;
      centerLat = currentTipLat;
    } else if (frame <= nyToParisEndFrame) {
      // Phase 3: NY to Paris - follow line tip, zoom out more for Atlantic crossing
      const crossingZoom = interpolate(
        nyToParisProgress,
        [0, 0.5, 1],
        [4, 2.5, 4],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );
      zoom = crossingZoom;
      pitch = 0;
      bearing = 0;
      centerLng = currentTipLng;
      centerLat = currentTipLat;
    } else {
      // Phase 4: Zoom into Paris/Eiffel Tower with 3D
      zoom = interpolate(parisZoomProgress, [0, 1], [4, 16]);
      pitch = interpolate(parisZoomProgress, [0, 1], [0, 60]);
      bearing = interpolate(parisZoomProgress, [0, 1], [0, -30]);
      centerLng = PARIS_COORDS[0];
      centerLat = PARIS_COORDS[1];

      // Enable 3D buildings when zooming into Paris
      if (parisZoomProgress > 0.3) {
        map.setConfigProperty("basemap", "show3dObjects", true);
        map.setConfigProperty("basemap", "show3dLandmarks", true);
        map.setConfigProperty("basemap", "show3dBuildings", true);
      }
    }

    // Set camera position
    map.setCenter([centerLng, centerLat]);
    map.setZoom(zoom);
    map.setPitch(pitch);
    map.setBearing(bearing);

    map.once("idle", () => continueRender(animationHandle));
  }, [
    frame,
    map,
    fps,
    zoomOutEndFrame,
    laToNyEndFrame,
    nyToParisEndFrame,
    parisZoomEndFrame,
    delayRender,
    continueRender,
  ]);

  const style: React.CSSProperties = useMemo(
    () => ({ width, height, position: "absolute" }),
    [width, height]
  );

  return <AbsoluteFill ref={ref} style={style} />;
};
