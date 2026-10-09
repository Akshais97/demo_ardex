import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LocateFixed, MapPin, Maximize2, WifiOff } from 'lucide-react';
import { Button, Badge } from './primitives';
import { type Opportunity, type Layer, layerWeight, LOCALITIES } from './data';

maplibregl.setWorkerUrl(workerUrl);

export function BusinessMap({
  rows,
  layer,
  sample,
  onSelect,
  selected,
}: {
  rows: Opportunity[];
  layer: Layer;
  sample: boolean;
  onSelect: (name: string) => void;
  selected: string;
}) {
  const container = useRef<HTMLDivElement>(null),
    map = useRef<maplibregl.Map | null>(null);
  const callback = useRef(onSelect);
  callback.current = onSelect;
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [search, setSearch] = useState('');
  const mapped = rows.filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng));
  const features = {
    type: 'FeatureCollection' as const,
    features: mapped.map((r) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [r.lng!, r.lat!] },
      properties: {
        locality: r.locality,
        // Fixed scale across periods; mature cohorts must retain visible density
        // differences instead of saturating every Bengaluru neighbourhood.
        weight:
          (layer === 'approved' || layer === 'purchases' ? layerWeight(r, layer) / 100000 : 1) *
          0.06,
      },
    })),
  };
  const latest = useRef(features);
  latest.current = features;
  useEffect(() => {
    if (!container.current) return;
    let disposed = false;
    let instance: maplibregl.Map;
    try {
      instance = new maplibregl.Map({
        container: container.current,
        style: 'https://tiles.openfreemap.org/styles/positron',
        center: [77.635, 12.98],
        zoom: 10.2,
        minZoom: 8,
        maxZoom: 16,
        attributionControl: { compact: true },
      });
    } catch {
      setFailed(true);
      return;
    }
    map.current = instance;
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    const timer = window.setTimeout(() => {
      if (!instance.isStyleLoaded() && !disposed) setFailed(true);
    }, 20000);
    instance.on('error', (event) => {
      if (!instance.isStyleLoaded() && !disposed) {
        console.warn('Analytics basemap unavailable:', event.error?.message);
        setFailed(true);
      }
    });
    instance.on('load', () => {
      if (disposed) return;
      clearTimeout(timer);
      setReady(true);
      setFailed(false);
      instance.addSource('business-activity', { type: 'geojson', data: latest.current });
      instance.addLayer({
        id: 'business-heat',
        type: 'heatmap',
        source: 'business-activity',
        maxzoom: 15,
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 9, 0.8, 14, 1.8],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 9, 22, 14, 48],
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 0.15],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(23,135,121,0)',
            0.18,
            'rgba(100,198,178,.3)',
            0.4,
            '#7bd2ae',
            0.65,
            '#26a98b',
            0.82,
            '#087c70',
            1,
            '#073d3a',
          ],
        },
      });
      instance.addLayer({
        id: 'business-points',
        type: 'circle',
        source: 'business-activity',
        minzoom: 12,
        paint: {
          'circle-radius': 5,
          'circle-color': '#087c70',
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1.5,
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 14, 0.9],
        },
      });
      instance.on('click', 'business-points', (event) => {
        const name = event.features?.[0]?.properties?.locality;
        if (name) callback.current(name);
      });
      instance.on('mouseenter', 'business-points', () => {
        instance.getCanvas().style.cursor = 'pointer';
      });
      instance.on('mouseleave', 'business-points', () => {
        instance.getCanvas().style.cursor = '';
      });
    });
    const resize = new ResizeObserver(() => instance.resize());
    resize.observe(container.current);
    return () => {
      disposed = true;
      clearTimeout(timer);
      resize.disconnect();
      instance.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    if (ready)
      (
        map.current?.getSource('business-activity') as maplibregl.GeoJSONSource | undefined
      )?.setData(features);
  }, [rows, layer, ready]);
  useEffect(() => {
    const loc = LOCALITIES.find((l) => l.name === selected);
    if (loc) map.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 12.3, duration: 700 });
  }, [selected]);
  function searchLocality(value: string) {
    setSearch(value);
    const loc = LOCALITIES.find((l) => l.name === value);
    if (loc) map.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 12.5, duration: 700 });
  }
  return (
    <div className="an-map-wrap">
      <div
        ref={container}
        className="an-map"
        role="region"
        aria-label="Bengaluru geographic business activity map"
      />
      {!ready && !failed && (
        <div className="an-map-loading">
          <span className="an-spinner" />
          Loading Bengaluru map…
        </div>
      )}
      {failed && !ready && (
        <div className="an-map-fallback">
          <WifiOff size={25} />
          <b>Basemap unavailable</b>
          <span>Check your connection. The locality table remains available.</span>
        </div>
      )}
      <div className="an-map-toolbar">
        <label>
          <MapPin size={14} />
          <select
            aria-label="Find Bengaluru locality"
            value={search}
            onChange={(e) => searchLocality(e.target.value)}
          >
            <option value="">Find a locality</option>
            {LOCALITIES.map((l) => (
              <option key={l.name}>{l.name}</option>
            ))}
          </select>
        </label>
        <Button
          variant="outline"
          size="icon"
          aria-label="Reset map to Bengaluru"
          onClick={() => {
            setSearch('');
            map.current?.flyTo({ center: [77.635, 12.98], zoom: 10.2 });
          }}
        >
          <LocateFixed size={16} />
        </Button>
      </div>
      <div className="an-map-caption">
        <Badge>{sample ? 'Illustrative activity' : 'Recorded sites · includes demo'}</Badge>
        <span>
          {mapped.length} / {rows.length} records mapped
        </span>
      </div>
      <div className="an-map-legend">
        <span>Less</span>
        <i />
        <span>More</span>
        <small>
          {layer === 'approved' || layer === 'purchases'
            ? 'Value concentration'
            : 'Job concentration'}{' '}
          · relative density
        </small>
      </div>
      <Button
        className="an-map-expand"
        variant="outline"
        size="icon"
        aria-label="Expand map"
        onClick={() => {
          if (container.current?.requestFullscreen)
            container.current.requestFullscreen().catch(() => setFailed(true));
        }}
      >
        <Maximize2 size={16} />
      </Button>
      {ready && !mapped.length && (
        <div className="an-map-empty">No mapped activity for this selection.</div>
      )}
    </div>
  );
}
