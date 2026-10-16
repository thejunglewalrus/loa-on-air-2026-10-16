# Cheery jungle oasis
Palette: turquoise #2BB3A3, aqua #8FE0D6, deep lagoon #1F7A6B, dark lagoon #123F3A, night lagoon #0C2F2C; deeper stage shade #123E39.
Accents: sand #F4E7CF, coral #F27C6A, hibiscus #FF8FA3, palm #4E9E57, leaf #7FD07C, sunlit gold #F2C66B, bark #8A5A3C.
Base: vertical dark-lagoon gradient; broad upper-right gold radial wash at 0.4% maximum opacity; no texture in the reading area.
Landscape: mossy faceted rock cleft at x16-108/y56-1030; two offset drops with a mid-height ledge, thin aqua/cream flow, spray and pool ripples; shoreline remains below y1000.
Landscape: fronds within x1850-1920 below y96; coral/pink flowers near (1873,133)/(1890,180); upper-right header has only 9% foliage shadow.
Landscape: x112-1840/y96-1000 and the x112-480 chat region above the shore contain only the base; the card at (152,112), width1000, clears all art.
Portrait: y0-480 stays plain; thin side foliage starts at y498; blooms near (1054,534)/(1056,578).
Portrait: compact two-step rock cascade inside x0-140/y1700-1840, joining the original lower-left pool; shoreline and all other content remain unchanged.
Both: original turquoise pool, scalloped foam, softly drifting mist, wavy cream reflections, curved lower-right sand, three coral/pink shells and a small bark/gold torch.
CSS: use cover and centered positioning; edge cropping is intentional; choose the matching aspect-ratio asset to preserve safe zones.
Panels: keep paper #F4EEE1 and ink #1A1F2B; use rgba(12,47,44,.72) behind gold-bordered talking points and .92 opacity for chat; rail/header #0C2F2C.
Motion: SMIL only; 1.4s/2.4s downward tiled streaks on both tiers, pulsing foam, arcing spray, 2.5s ripples and 4.6-5.6s mist; 31 authored animation nodes/20 targets per SVG, including the unchanged flame; static fallback beneath .jungle-anim.
Reduced motion: embedded media query hides animated overlays; host CSS cannot reach SMIL inside a CSS background image, and animation-play-state does not pause SMIL.
