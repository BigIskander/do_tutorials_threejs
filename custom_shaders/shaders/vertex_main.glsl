        vec3 cords = normal;
        cords += uTime;
        vec3 noisePattern = vec3(cnoise(cords));
        float pattern = wave(noisePattern);
        
        // varyings
        vDisplacement = pattern;

        // MVP
        float displacement = vDisplacement / 3.0;

        transformed += normalize(objectNormal) * displacement;