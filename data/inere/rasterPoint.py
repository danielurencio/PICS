from osgeo import gdal,ogr
import struct,sys

src_filename = sys.argv[1]
shp_filename = sys.argv[2]
band = int(sys.argv[3])
bandStr = sys.argv[3]
value = sys.argv[4]

src_ds=gdal.Open(src_filename) 
gt=src_ds.GetGeoTransform()
rb=src_ds.GetRasterBand(band)

ds=ogr.Open(shp_filename,1)
lyr=ds.GetLayer()
# Add a new field
new_field = ogr.FieldDefn(value + bandStr, ogr.OFTInteger)
lyr.CreateField(new_field)

for feat in lyr:
    geom = feat.GetGeometryRef()
    mx,my=geom.GetX(), geom.GetY()  #coord in map units

    #Convert from map to pixel coordinates.
    #Only works for geotransforms with no rotation.
    #If raster is rotated, see http://code.google.com/p/metageta/source/browse/trunk/metageta/geometry.py#493
    px = int((mx - gt[0]) / gt[1]) #x pixel
    py = int((my - gt[3]) / gt[5]) #y pixel

    structval=rb.ReadRaster(px,py,1,1,buf_type=gdal.GDT_UInt16) #Assumes 16 bit int aka 'short'
    intval = struct.unpack('h' , structval) #use the 'short' format code (2 bytes) not int (4 bytes)

    #print intval[0] #intval is a tuple, length=1 as we only asked for 1 pixel value
    feat.SetField(value + bandStr, intval[0]) 
    # trigger the update
    lyr.SetFeature(feat)

# Close the Shapefile
ds = None
